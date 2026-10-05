import React from 'react';
import {Button,type ButtonProps} from './atoms';
import {ActionGroup} from './composition';
import {Container} from './layout';
import './bottom-cta.css';
export type BottomCTAAction=ButtonProps & {children:React.ReactNode};
export type BottomCTAProps={actions:readonly[BottomCTAAction]|readonly[BottomCTAAction,BottomCTAAction];placement?:'flow'|'fixed';topAccessory?:React.ReactNode;bottomAccessory?:React.ReactNode;safeArea?:boolean;label?:string;className?:string};
const RegionContext=React.createContext<{register:React.Dispatch<React.SetStateAction<HTMLDivElement|null>>;ready:boolean}|null>(null);
export function BottomCTA({actions,placement='flow',topAccessory,bottomAccessory,safeArea=true,label='하단 작업',className=''}:BottomCTAProps){
 const region=React.useContext(RegionContext);
 if(actions.length<1||actions.length>2)throw new RangeError('BottomCTA: 동작은 한 개 또는 두 개여야 합니다.');
 if(placement==='fixed'&&!region)throw new Error('고정 BottomCTA에는 BottomCTARegion이 필요합니다.');
 return <div ref={placement==='fixed'?region!.register:undefined} data-bottom-cta-panel data-requested={placement} data-placement={placement==='fixed'&&region?.ready?'fixed':'flow'} data-safe-area={safeArea} className={`ds-bottom-cta ${className}`}>
  <Container>{topAccessory&&<div className="ds-bottom-cta-accessory">{topAccessory}</div>}<ActionGroup label={label}>{actions.map((action,index)=><Button key={index} variant={actions.length===2&&index===0?'secondary':'primary'} {...action}/>)}</ActionGroup>{bottomAccessory&&<div className="ds-bottom-cta-accessory">{bottomAccessory}</div>}</Container>
 </div>;
}
export type BottomCTARegionProps={children:React.ReactNode;cta:React.ReactElement<BottomCTAProps,typeof BottomCTA>;className?:string;style?:React.CSSProperties};
export function BottomCTARegion({children,cta,className='',style}:BottomCTARegionProps){
 const [panel,setPanel]=React.useState<HTMLDivElement|null>(null);
 const [height,setHeight]=React.useState(0);
 const body=React.useRef<HTMLDivElement>(null);
 const supported=typeof ResizeObserver!=='undefined';
 const protectFocus=React.useCallback(()=>{
  const target=document.activeElement;
  if(!panel||!body.current||!(target instanceof HTMLElement)||!body.current.contains(target))return;
  const targetRect=target.getBoundingClientRect(),panelRect=panel.getBoundingClientRect();
  if(!targetRect.height||!panelRect.height)return;
  const overlap=targetRect.bottom+8-panelRect.top;
  if(overlap<=0)return;
  if(body.current.scrollHeight>body.current.clientHeight+1)body.current.scrollTop+=overlap;
  else window.scrollBy({top:overlap,behavior:'instant'});
 },[panel]);
 React.useLayoutEffect(()=>{
  if(!panel||!supported){setHeight(0);return;}
  let frame=0;
  const measure=()=>{const next=panel.getBoundingClientRect().height;setHeight(old=>old===next?old:next);cancelAnimationFrame(frame);frame=requestAnimationFrame(protectFocus);};
  const observer=new ResizeObserver(measure);
  try{observer.observe(panel,{box:'border-box'});}catch{observer.disconnect();setHeight(0);return;}
  measure();
  window.addEventListener('resize',measure);
  return ()=>{observer.disconnect();window.removeEventListener('resize',measure);cancelAnimationFrame(frame);};
 },[panel,supported,protectFocus]);
 const ready=supported&&panel!==null&&height>0;
 return <div data-bottom-cta-region className={`ds-bottom-cta-region ${className}`} style={{...style,'--ds-bottom-cta-height':`${ready?height:0}px`} as React.CSSProperties}>
  <div ref={body} data-bottom-cta-body className="ds-bottom-cta-body" onFocusCapture={protectFocus}>{children}{ready&&<div data-bottom-cta-spacer aria-hidden="true" className="ds-bottom-cta-spacer"/>}</div>
  <RegionContext.Provider value={{register:setPanel,ready}}>{cta}</RegionContext.Provider>
 </div>;
}
