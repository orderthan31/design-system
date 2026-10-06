import React, {createContext, useContext, useState} from 'react';
import {createPortal} from 'react-dom';
import {Tabs, Stack} from '../index';

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
   {label:'Docs',content:<><section className="gallery-consumer-setup"><h3>사용 설정</h3><p>공개 진입점 src/index와 core.css를 가져오고 루트를 ds-core로 감싸세요. core.css는 기본 theme와 scoped tokens를 포함해요. Pretendard 파일은 소비 앱의 /source/fonts/에 제공하세요. gallery.css·playground.css·App은 컴포넌트 외관에 필요하지 않아요.</p><p>현재 저장소 소스를 가져오는 방식이며 미발행 npm 패키지 설치 명령은 없어요. React/ReactDOM 및 Chart의 Recharts, PasswordInput의 Radix Toggle 등 실제 의존성은 저장소 package.json·lockfile의 버전을 사용해요. 테마는 공개 applyTheme/theme API를 소비 앱의 ds-core 범위에 적용하고, 예제 설정과 컨테이너 조건을 같게 맞추세요.</p></section><div ref={setDocs} className="gallery-docs-panel"/></>},
  ]}/></div>
 </Stack></div></WorkbenchContext.Provider>;
}
