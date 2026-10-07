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
   {label:'Docs',content:<><section className="gallery-consumer-setup"><h3>사용 설정</h3><p>선택 source 설치를 지원하는 항목은 공식 shadcn GitHub registry에서 필요한 owner만 설치합니다. 설치된 src/gyeol/components 파일을 직접 가져오고 ds-core 범위 안에서 사용하세요. owner가 기본 theme·scoped tokens·자기 CSS를 포함하므로 core/gallery CSS나 공개 barrel 전체는 필요하지 않습니다. 지원 항목과 명령은 선택 소스 설치 계약을 확인하세요. 저장소 전체 소스를 사용하는 방식은 기존 src/index + core.css입니다. Pretendard 파일·LICENSE는 소비 앱 /source/fonts/에 별도로 제공해야 하며 자동 복사되지 않습니다.</p><p>미발행 npm 패키지를 설치한다고 안내하지 않습니다. 선택 item에 선언된 실제 dependency만 CLI가 소비자의 package.json·lock에 반영합니다. Button·native control에는 Chart/Recharts나 gallery renderer를 붙이지 않으며 ReactDOM은 소비 앱의 렌더러 설정입니다. 선택 owner의 root/nested semantic·component CSS 변수 override와 저장소 전체의 공개 applyTheme/theme API를 구분하고, 예제 설정·컨테이너 조건을 같게 맞추세요.</p></section><div ref={setDocs} className="gallery-docs-panel"/></>},
  ]}/></div>
 </Stack></div></WorkbenchContext.Provider>;
}
