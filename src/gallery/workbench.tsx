import React, {createContext, useContext, useState} from 'react';
import {createPortal} from 'react-dom';
import {Tabs, Stack} from '../index';
import {UsageGuide} from './usage-guide';

type Hosts = {variant:HTMLElement|null;code:HTMLElement|null;docs:HTMLElement|null};
const WorkbenchContext=createContext<Hosts|null>(null);
export function GallerySlot({slot,children}:{slot:keyof Hosts;children:React.ReactNode}) {
 const hosts=useContext(WorkbenchContext);
 if(!hosts)return <>{children}</>;
 return hosts[slot]?createPortal(children,hosts[slot]):null;
}
export function GalleryControls({as:Element='div',...props}:React.HTMLAttributes<HTMLElement>&{as?:'div'|'fieldset'}) {
 return <GallerySlot slot="variant"><Element {...props}/></GallerySlot>;
}
export function GalleryDocs({children,className}:React.PropsWithChildren<{className?:string;open?:boolean}>) {
 const nodes=React.Children.toArray(children);
 const summary=nodes.find(node=>React.isValidElement(node)&&node.type==='summary') as React.ReactElement<React.PropsWithChildren>|undefined;
 const content=nodes.filter(node=>node!==summary&&!(typeof node==='string'&&!node.trim()));
 if(content.length===1&&React.isValidElement(content[0])&&Object.hasOwn(content[0].props as object,'source'))return <>{content}</>;
 return <GallerySlot slot="docs"><section className={className}><h3>{summary?.props.children}</h3>{content}</section></GallerySlot>;
}
export function VariantExamples({children}:React.PropsWithChildren) {
 return <GallerySlot slot="variant"><WorkbenchContext.Provider value={null}><section className="gallery-extra-examples" aria-label="추가 시연">{children}</section></WorkbenchContext.Provider></GallerySlot>;
}
export function ComponentWorkbench({children,name}:React.PropsWithChildren<{name:string}>) {
 const fields=['Input','Textarea','Select','PasswordInput','TextField','SearchInput','EmailInput','URLInput','NumberInput','TelInput','FileInput','DatePicker','MonthPicker','TimeInput','Combobox','InputGroup'];
 const forms=['FormField','DateRangePicker','DateTimeInput','AddressInput','MultiSelect'];
 const layout=fields.includes(name)?'field':forms.includes(name)?'form':'wide';
 const [variant,setVariant]=useState<HTMLElement|null>(null);
 const [code,setCode]=useState<HTMLElement|null>(null);
 const [docs,setDocs]=useState<HTMLElement|null>(null);
 return <WorkbenchContext.Provider value={{variant,code,docs}}><div className="gallery-workbench"><Stack>
  <section className="gallery-live-demo" data-layout={layout} aria-label="컴포넌트 시연">{children}</section>
  <div className="gallery-detail-tabs"><Tabs label="컴포넌트 상세" items={[
   {label:'Variant',content:<div ref={setVariant} className="gallery-variant-panel"/>},
   {label:'Code',content:<div ref={setCode} className="gallery-code-panel"/>},
   {label:'Docs',content:<><UsageGuide name={name}/><div ref={setDocs} className="gallery-docs-panel"/><p className="help"><a href="https://github.com/orderthan31/design-system/blob/main/docs/source-installation.md">소스 설치와 글꼴 설정 안내 ↗</a></p></>},
  ]}/></div>
 </Stack></div></WorkbenchContext.Provider>;
}
