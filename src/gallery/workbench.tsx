import React, {createContext, useContext, useState} from 'react';
import {createPortal} from 'react-dom';
import {Tabs, Stack, Button} from '../index';
import {UsageGuide} from './usage-guide';
import './workbench.css';

type Hosts = {variant:HTMLElement|null;code:HTMLElement|null;docs:HTMLElement|null};
// An example keeps only its own variants/controls, never inline Code or Docs.
const WorkbenchContext=createContext<Hosts|'examples'|null>(null);
export function GallerySlot({slot,children}:{slot:keyof Hosts;children:React.ReactNode}) {
 const hosts=useContext(WorkbenchContext);
 if(hosts==='examples')return slot==='variant'?<>{children}</>:null;
 if(!hosts)return <>{children}</>;
 return hosts[slot]?createPortal(children,hosts[slot]):null;
}
export function GalleryControls({as:Element='div',...props}:React.HTMLAttributes<HTMLElement>&{as?:'div'|'fieldset'}) {
 return <GallerySlot slot="variant"><section className="gallery-example-settings" aria-label="현재 예제의 설정"><h3>현재 예제 설정</h3><Element {...props} data-gallery-settings/></section></GallerySlot>;
}
export function GalleryDocs({children,className}:React.PropsWithChildren<{className?:string;open?:boolean}>) {
 const nodes=React.Children.toArray(children);
 const summary=nodes.find(node=>React.isValidElement(node)&&node.type==='summary') as React.ReactElement<React.PropsWithChildren>|undefined;
 const content=nodes.filter(node=>node!==summary&&!(typeof node==='string'&&!node.trim()));
 // CodeBlock owns the Code slot. It must never become a Docs passthrough.
 const code=content.filter(node=>React.isValidElement(node)&&Object.hasOwn(node.props as object,'source'));
 const prose=content.filter(node=>!code.includes(node));
 return <>{code}{prose.length>0&&<GallerySlot slot="docs"><section className={className}><h3>{summary?.props.children}</h3>{prose}</section></GallerySlot>}</>;
}
export function VariantExamples({children}:React.PropsWithChildren) {
 return <GallerySlot slot="variant"><WorkbenchContext.Provider value="examples"><section className="gallery-extra-examples" aria-label="같은 컴포넌트의 추가 상태"><h3>추가 상태 예제</h3>{children}</section></WorkbenchContext.Provider></GallerySlot>;
}
export function ComponentWorkbench({children,name}:React.PropsWithChildren<{name:string}>) {
 const fields=['Input','Textarea','Select','PasswordInput','TextField','SearchField','EmailInput','NumberInput','CurrencyInput','PhoneInput','FileInput','DatePicker','MonthPicker','TimeInput','Combobox'];
 const forms=['FormField','DateRangePicker','DateTimeInput','AddressField','MultiSelect'];
 const layout=fields.includes(name)?'field':forms.includes(name)?'form':'wide';
 const [variant,setVariant]=useState<HTMLElement|null>(null);
 const [code,setCode]=useState<HTMLElement|null>(null);
 const [docs,setDocs]=useState<HTMLElement|null>(null);
 const [revision,setRevision]=useState(0);
 return <WorkbenchContext.Provider value={{variant,code,docs}}><div className="gallery-workbench" data-component-workbench={name}><Stack>
  <section className="gallery-live-demo" data-layout={layout} aria-label={`${name} 실제 시연`}><React.Fragment key={revision}>{children}</React.Fragment></section>
  <div className="gallery-detail-tabs"><Tabs label="컴포넌트 상세" items={[
   {label:'Variant',content:<><div className="gallery-reset-row"><p className="help">현재 컴포넌트의 예제 설정을 바꿔 비교하세요.</p><Button variant="ghost" onClick={()=>setRevision(value=>value+1)} data-gallery-reset>전체 예제 초기화</Button></div><div ref={setVariant} className="gallery-variant-panel"/></>},
   {label:'Code',content:<div ref={setCode} className="gallery-code-panel"/>},
   {label:'Docs',content:<><UsageGuide name={name}/><div ref={setDocs} className="gallery-docs-panel"/><p className="help"><a href="https://github.com/orderthan31/design-system/blob/main/docs/source-installation.md">소스 설치와 글꼴 설정 안내 ↗</a></p></>},
  ]}/></div>
 </Stack></div></WorkbenchContext.Provider>;
}
