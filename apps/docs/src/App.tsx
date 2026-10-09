import { useEffect, useId, useRef, useState, type MouseEvent, type FormEvent } from 'react';
import { docsPages, parsePageHash, pageHref, type DocsPage } from './navigation';
import { Theme } from './gyeol/foundation/theme';
import { Button, type ButtonProps } from './gyeol/primitives/button';
import { Input } from './gyeol/primitives/input';
import { TextField } from './gyeol/components/text-field';
import { Select } from './gyeol/primitives/select';
import { Tabs,TabsList,TabsTrigger,TabsContent } from './gyeol/primitives/tabs';
import { Dialog,DialogTrigger,DialogContent,DialogTitle,DialogDescription,DialogClose } from './gyeol/primitives/dialog';
import { FormSection,ListPanel } from './gyeol/components/composition';
import { List,ListItem,Row,Stack } from './gyeol/primitives/layout';
import { List as CanonicalList, ListItem as CanonicalListItem } from '../../../packages/ui/src/primitives/layout';
import { TaskExample } from './task-example';
import { Customization } from './customization';
import { BehaviorProofs } from './proofs';
const inputDefaults={controlled:'읽고, 정리하고, 이어 가기',uncontrolled:'처음 적은 메모'};
const listDefaults={items:[{id:'first',text:'오늘의 첫 작업'},{id:'next',text:'다음에 이어 갈 작업'}],divider:true};
const longListItems=[
 {id:'first',text:'오늘 확인한 내용을 차분하게 정리하고, 함께 일하는 사람이 맥락을 이해할 수 있도록 필요한 설명과 다음에 확인할 질문을 메모로 남겨 주세요. 긴 한국어 문장도 생략하지 않고 여러 줄로 읽을 수 있습니다.'},
 {id:'next',text:'다음에 이어 갈 작업은 준비된 자료를 다시 읽는 것부터 시작합니다. 서두르지 않고 놓친 내용을 살펴본 뒤, 결정한 이유와 아직 확인하지 못한 내용을 구분하여 기록해 주세요.'},
];
const listItemDefaults={title:'오늘의 첫 작업',description:'필요한 내용을 확인하고 메모를 남겨 주세요.',showDescription:true,checked:false};
const longListItemCopy={title:'함께 일하는 사람이 다음 작업을 자연스럽게 이어 갈 수 있도록 오늘 확인한 내용과 남은 질문을 차분하게 정리해 주세요',description:'결정한 이유와 아직 확인하지 못한 내용을 구분하여 기록합니다. 제목과 설명은 생략하지 않고 읽으며, 선택과 보조 액션은 별도로 조작합니다. 공백 없는 참고 식별자도 확인해 보세요: HangyeolDesignSystemListItemReference0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'};
const references:Record<string,string>={
 Button:'HTMLButtonElement ref. native props, type="button" 기본값. variant: primary | secondary | quiet, size: small | medium. loading은 disabled와 aria-busy를 적용합니다. asChild는 지원하지 않습니다.',
 Input:'InputProps는 InputHTMLAttributes<HTMLInputElement>에 invalid/loading만 추가합니다. ref는 실제 HTMLInputElement이며 className, name, form, type, value/defaultValue, onChange와 기타 native 속성·이벤트를 그대로 전달합니다. className은 주변 배치 용도로 사용하세요. invalid는 semantic error border, loading은 aria-busy만 바꾸며 disabled를 대신하지 않습니다. 포커스는 별도의 semantic outline으로 구분합니다.',
 TextField:'HTMLInputElement ref/className/native props는 실제 input, wrapperProps는 외부 div입니다. value + onValueChange로 제어하거나 defaultValue로 비제어합니다. clear는 onValueChange("")를 알립니다. 합성 ChangeEvent나 DOM value mutation은 하지 않습니다. 비제어 native reset은 최초 defaultValue를 복원하며 제어 reset은 owner 책임입니다.',
 Select:'ref는 HTMLButtonElement Trigger입니다. options, value/defaultValue, onValueChange(string), name, required를 지원합니다. Radix가 keyboard/typeahead/focus를 관리합니다. 비제어 native reset은 defaultValue로 돌아갑니다. 제어 form reset은 최초 값(defaultValue 또는 최초 value)을 onValueChange로 요청합니다. owner는 이를 적용하거나 form의 reset을 preventDefault해야 합니다. 값은 owner 소유이며 묵시 DOM mutation을 하지 않습니다. FormData는 Radix hidden native select로 전달됩니다. HTMLSelectElement/ChangeEvent 호환 API가 아닙니다.',
 Tabs:'Radix Root value/defaultValue/onValueChange, activationMode automatic/manual, orientation. TabsList ref HTMLDivElement, TabsTrigger ref HTMLButtonElement, TabsContent는 Radix Content API. disabled trigger는 roving focus에서 빠집니다. 예제 state는 docs 패널 밖에서 소유합니다.',
 Dialog:'Radix Root open/defaultOpen/onOpenChange. Content ref HTMLDivElement. Trigger ref HTMLButtonElement (asChild일 때 실제 child). Title HTMLHeadingElement, Description HTMLParagraphElement. 기본 trigger focus return은 Radix 책임입니다. trigger 없는/초기 open/async close는 Content returnFocusRef로 복귀 대상을 지정합니다. 직접 showModal/focus engine을 병행하지 않습니다.',
 Layout:'Stack/Row ref HTMLDivElement, native props 전달. Stack은 세로 흐름, Row는 줄바꿈 가능한 가로 흐름입니다. className은 layout utility 용도로 사용합니다.',
 List:'List는 native ul, 바로 아래 ListItem은 native li입니다. ref는 각각 실제 HTMLUListElement / HTMLLIElement이며 className과 native 속성·이벤트는 같은 ul/li에 전달됩니다. divider?: boolean은 기본 true이며 false이면 구분선을 끕니다. divider는 DOM 속성으로 전달하지 않습니다. 긴 내용의 줄바꿈은 ListItem 소유의 정적 class로 처리하며 className은 주변 배치에 사용하세요.',
 ListItem:'ListItem은 List 아래에 조합하는 native li입니다. ref는 실제 HTMLLIElement이며 children, className, native 속성·이벤트를 같은 li로 전달합니다. selected/disabled/error 같은 전용 상태 prop이나 행 전체의 클릭 동작은 없습니다. flex-wrap / min-w-0 / break-keep / wrap-anywhere는 정적 소스의 줄바꿈 근거이며 실제 화면 배치 검증을 대신하지 않습니다.',
 FormSection:'section ref HTMLElement. heading/description/actions와 children을 조합합니다. form submit과 값의 소유자는 소비자입니다.',
 ListPanel:'section ref HTMLElement. heading/description/actions 아래에 native List를 배치합니다. children은 ListItem이며 empty/loading은 예제 owner가 렌더합니다.',
};
const exampleDetails:Record<string,{imports:string;closure:string;dependency:string;form:string}>={
 Button:{imports:"import { Button } from './gyeol/primitives/button';\nimport { Row } from './gyeol/primitives/layout';",closure:'Button → lib/cn.ts. 이 예제의 Row는 별도로 layout 소스를 사용합니다.',dependency:'추가 Radix 의존성은 없습니다.',form:'native button입니다. form submit이 필요하면 type="submit"을 명시하세요. 이 예제의 실행 횟수는 owner state입니다.'},
 Input:{imports:"import { useId, useRef, useState, type FormEvent } from 'react';\nimport { Input } from './gyeol/primitives/input';\nimport { Button } from './gyeol/primitives/button';\nimport { Row } from './gyeol/primitives/layout';",closure:'Input → lib/cn.ts. 예제의 Button과 Row는 별도 소스를 사용합니다.',dependency:'추가 Radix 의존성은 없습니다.',form:'두 입력은 보이는 label과 고유 id로 연결됩니다. required는 native 유효성 검사에 참여합니다. readOnly는 편집을 막지만 값을 제출하고, disabled는 편집·포커스·제출에서 제외합니다. name은 FormData의 키이며 form 속성으로 외부 form에도 연결할 수 있습니다. 제어 입력은 value + onChange, 비제어 입력은 고정 defaultValue를 사용합니다. form의 onReset은 owner의 제어 값과 옵션·피드백을 기본값으로 돌립니다. preventDefault 없이 native reset을 진행하므로 비제어 값은 최초 defaultValue로 복원됩니다. Reset 버튼도 같은 form.reset()을 호출하며 DOM을 다시 mount하지 않습니다.'},
 TextField:{imports:"import { TextField } from './gyeol/components/text-field';",closure:'TextField → Input + Button + lib/cn.ts.',dependency:'추가 Radix 의존성은 없습니다.',form:'label은 실제 input id에 연결됩니다. name/required/readOnly는 input에 전달됩니다. clearable은 disabled/readOnly일 때 지우기를 막습니다.'},
 Select:{imports:"import { Select } from './gyeol/primitives/select';",closure:'Select → portal.tsx + foundation/theme.tsx + lib/cn.ts.',dependency:'@radix-ui/react-select 2.3.8이 필요합니다.',form:'name + required를 사용하면 hidden native select가 form 연결을 담당합니다. onValueChange는 문자열이며 native select change event가 아닙니다.'},
 Tabs:{imports:"import { Tabs, TabsList, TabsTrigger, TabsContent } from './gyeol/primitives/tabs';",closure:'Tabs → lib/cn.ts. portal/theme 소스를 요구하지 않습니다.',dependency:'@radix-ui/react-tabs 1.1.22가 필요합니다.',form:'form value를 제출하는 입력이 아닙니다. 이 예제의 Disabled는 두 번째 TabsTrigger에만 적용됩니다. 활성 value는 owner가 관리합니다.'},
 Dialog:{imports:"import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from './gyeol/primitives/dialog';\nimport { Button } from './gyeol/primitives/button';",closure:'Dialog → portal.tsx + foundation/theme.tsx + lib/cn.ts. 예제 Trigger/Close는 별도로 Button을 사용합니다.',dependency:'@radix-ui/react-dialog 1.2.0이 필요합니다.',form:'Dialog 자체가 form submit을 만들지 않습니다. 이 예제의 Disabled는 Trigger의 Button에만 적용됩니다. open/onOpenChange는 owner가 관리하며 Modal 안의 Reset example도 같은 state를 초기화합니다.'},
 List:{imports:"import { List, ListItem } from '../../../packages/ui/src/primitives/layout';",closure:'이 List 예제와 Code는 같은 로컬 canonical layout 소스를 사용합니다. List / ListItem → packages/ui/src/lib/cn.ts. portal/theme 소스는 요구하지 않습니다.',dependency:'추가 Radix 의존성은 없습니다.',form:'항목 내용과 빈 목록 안내는 owner 책임입니다. 빈 경우 ul은 li 없이 유지하고 안내는 ul 밖에 둡니다. 항목은 안정적인 id를 key로 사용합니다. List는 form 값이나 disabled/readOnly 동작을 만들지 않으며 클릭 가능한 행이나 업무 상태를 정의하지 않습니다.'},
 ListItem:{imports:"import { List, ListItem } from '../../../packages/ui/src/primitives/layout';\nimport { Button } from './gyeol/primitives/button';",closure:'Live와 Code는 같은 canonical List / ListItem → packages/ui/src/lib/cn.ts를 사용합니다. Button은 기존 설치 소스 → lib/cn.ts입니다. 설치된 layout 미러를 새로 갱신한 예제가 아닙니다.',dependency:'추가 Radix 의존성은 없습니다.',form:'정보 children 다음에 native checkbox와 독립 Button을 배치합니다. label은 checkbox 하나에만 연결되며 Button을 감싸지 않습니다. 선택 값과 액션 피드백은 owner state이고 li 자체는 선택·비활성화·form 값을 만들지 않습니다. Button은 type="button"으로 보조 동작만 실행합니다.'},
};
function ExampleWorkbench({page}:{page:string}){
 const [value,setValue]=useState('읽고, 정리하고, 이어 가기'),[variant,setVariant]=useState<NonNullable<ButtonProps['variant']>>('primary'),[size,setSize]=useState<NonNullable<ButtonProps['size']>>('medium'),[loading,setLoading]=useState(false),[disabled,setDisabled]=useState(false),[count,setCount]=useState(0),[selected,setSelected]=useState('first'),[tab,setTab]=useState('one'),[open,setOpen]=useState(false),[panel,setPanel]=useState('variant');
 const dialogReturnRef=useRef<HTMLButtonElement>(null);
 const inputFormRef=useRef<HTMLFormElement>(null),inputId=useId();
 const [readOnly,setReadOnly]=useState(false),[required,setRequired]=useState(false),[uncontrolledValue,setUncontrolledValue]=useState(inputDefaults.uncontrolled),[inputSubmission,setInputSubmission]=useState<string|null>(null);
 const [listItems,setListItems]=useState(listDefaults.items),[listDivider,setListDivider]=useState(listDefaults.divider);
 const listItemId=useId();
 const [listItemCopy,setListItemCopy]=useState({title:listItemDefaults.title,description:listItemDefaults.description});
 const [listItemShowDescription,setListItemShowDescription]=useState(listItemDefaults.showDescription),[listItemChecked,setListItemChecked]=useState(listItemDefaults.checked),[listItemActionCount,setListItemActionCount]=useState(0);
 const resetListItem=()=>{setListItemCopy({title:listItemDefaults.title,description:listItemDefaults.description});setListItemShowDescription(listItemDefaults.showDescription);setListItemChecked(listItemDefaults.checked);setListItemActionCount(0);};
 const resetInput=()=>{setValue(inputDefaults.controlled);setUncontrolledValue(inputDefaults.uncontrolled);setReadOnly(false);setRequired(false);setDisabled(false);setInputSubmission(null);};
 const submitInput=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();setInputSubmission(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));};
 const reset=()=>{if(page==='Input'){inputFormRef.current?.reset();return;}if(page==='List'){setListItems(listDefaults.items);setListDivider(listDefaults.divider);return;}if(page==='ListItem'){resetListItem();return;}setValue('읽고, 정리하고, 이어 가기');setVariant('primary');setSize('medium');setLoading(false);setDisabled(false);setCount(0);setSelected('first');setTab('one');setOpen(false);};
 const options=[{value:'first',label:'첫 번째'},{value:'second',label:'두 번째'}];
 let live,code;
 if(page==='Button'){live=<Row><Button variant={variant} size={size} loading={loading} disabled={disabled} onClick={()=>setCount(current=>current+1)}>계속하기</Button><p className="text-g-small text-g-soft">{count}번 실행</p></Row>;code='';}
 else if(page==='Input'){live=<form ref={inputFormRef} onReset={resetInput} onSubmit={submitInput} className="grid gap-4">
  <div className="grid gap-2">
   <label htmlFor={`${inputId}-controlled`} className="text-g-small">제어 입력 (value + onChange)</label>
   <Input id={`${inputId}-controlled`} name="controlled" value={value} onChange={event=>setValue(event.target.value)} readOnly={readOnly} required={required} disabled={disabled}/>
   <p className="text-g-small text-g-soft">현재 제어 값: {JSON.stringify(value)}</p>
  </div>
  <div className="grid gap-2">
   <label htmlFor={`${inputId}-uncontrolled`} className="text-g-small">비제어 입력 (defaultValue)</label>
   <Input id={`${inputId}-uncontrolled`} name="uncontrolled" defaultValue={inputDefaults.uncontrolled} onChange={event=>setUncontrolledValue(event.target.value)} readOnly={readOnly} required={required} disabled={disabled}/>
   <p className="text-g-small text-g-soft">현재 비제어 값: {JSON.stringify(uncontrolledValue)} · 최초 defaultValue: {JSON.stringify(inputDefaults.uncontrolled)}</p>
  </div>
  <Row><Button type="submit">FormData 제출</Button><Button type="reset" variant="secondary">Native form reset</Button></Row>
  <p role="status" className="text-g-small text-g-soft">{inputSubmission===null?'제출하면 name별 값이 표시됩니다. Disabled 입력은 제출에서 제외됩니다.':`제출 결과: ${inputSubmission}`}</p>
 </form>;code='';}
 else if(page==='TextField'){live=<TextField label="제목" value={value} onValueChange={setValue} disabled={disabled} clearable/>;code='';}
 else if(page==='Select'){live=<Select label="선택 예제" value={selected} onValueChange={setSelected} disabled={disabled} options={options}/>;code='';}
 else if(page==='Tabs'){live=<Tabs value={tab} onValueChange={setTab}><TabsList aria-label="예제 탭"><TabsTrigger value="one">첫 화면</TabsTrigger><TabsTrigger value="two" disabled={disabled}>다음 화면</TabsTrigger></TabsList><TabsContent value="one" className="mt-4">차분하게 시작하세요.</TabsContent><TabsContent value="two" className="mt-4">다음 단계로 이어 갑니다.</TabsContent></Tabs>;code='';}
 else if(page==='Dialog'){live=<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button disabled={disabled}>안내 열기</Button></DialogTrigger><DialogContent returnFocusRef={disabled?dialogReturnRef:undefined}><DialogTitle>한 걸음씩</DialogTitle><DialogDescription>내용을 확인하고 다음 작업으로 이어 가세요.</DialogDescription><DialogClose asChild><Button>확인</Button></DialogClose><Button variant="quiet" onClick={reset}>Reset example</Button></DialogContent></Dialog>;code='';}
 else if(page==='Layout'){live=<Stack><p>자연스러운 세로 흐름</p><Row><Button variant="secondary">이전</Button><Button>다음</Button></Row></Stack>;code='<Stack>\n  <p>자연스러운 세로 흐름</p>\n  <Row><Button variant="secondary">이전</Button><Button>다음</Button></Row>\n</Stack>';}
 else if(page==='List'){live=<div className="grid gap-4"><CanonicalList aria-label="메모 목록" divider={listDivider}>{listItems.map(item=><CanonicalListItem key={item.id} data-item-id={item.id}><span className="min-w-0 flex-1">{item.text}</span></CanonicalListItem>)}</CanonicalList>{listItems.length===0&&<p className="text-g-small text-g-soft">아직 메모가 없습니다.</p>}</div>;code='';}
 else if(page==='ListItem'){live=<div className="grid gap-4 min-w-0">
  <CanonicalList aria-label="선택과 보조 액션이 있는 메모">
   <CanonicalListItem data-item-id="memo">
    <div className="grid gap-2 min-w-0 w-full"><h3 className="font-medium">{listItemCopy.title}</h3>{listItemShowDescription&&<p className="text-g-soft leading-7">{listItemCopy.description}</p>}</div>
    <label htmlFor={listItemId} className="inline-flex min-h-11 items-center gap-2"><input id={listItemId} type="checkbox" name="memo" value="memo" checked={listItemChecked} onChange={event=>setListItemChecked(event.target.checked)}/> 이 메모 선택</label>
    <Button type="button" variant="secondary" onClick={()=>setListItemActionCount(current=>current+1)}>보조 액션 실행</Button>
   </CanonicalListItem>
  </CanonicalList>
  <p role="status" className="text-g-small text-g-soft">선택: {listItemChecked?'선택됨':'선택 안 됨'} · 보조 액션: {listItemActionCount}번 실행</p>
 </div>;code='';}
 else if(page==='FormSection'){live=<FormSection heading="기본 정보" description="필요한 것만 입력하세요."><TextField label="이름" value={value} onValueChange={setValue}/></FormSection>;code=`<FormSection heading="기본 정보" description="필요한 것만 입력하세요.">\n  <TextField label="이름" value={${JSON.stringify(value)}} onValueChange={setValue} />\n</FormSection>`;}
 else if(page==='ListPanel'){live=<ListPanel heading="메모" description="1개의 항목"><ListItem>{value}</ListItem></ListPanel>;code=`<ListPanel heading="메모" description="1개의 항목"><ListItem>${value}</ListItem></ListPanel>`;}
 else{live=<List><ListItem>오늘의 첫 작업</ListItem><ListItem>다음에 이어 갈 작업</ListItem></List>;code='<List><ListItem>오늘의 첫 작업</ListItem><ListItem>다음에 이어 갈 작업</ListItem></List>';}
 const detail=exampleDetails[page];
 if(detail){
  const snapshot=(imports:string,state:string,jsx:string)=>`import { ${page==='Input'?'useId, useRef, useState, type FormEvent':page==='ListItem'?'useId, useState':page==='Dialog'?'useState, useRef':'useState'} } from 'react';\n${imports}\n\nexport function CurrentExample() {\n${state}\n  return (\n${jsx}\n  );\n}`;
  const disabledState=`  const [disabled] = useState(${disabled});`;
  if(page==='Button')code=snapshot("import { Button, type ButtonProps } from './gyeol/primitives/button';\nimport { Row } from './gyeol/primitives/layout';",`  const [variant] = useState<NonNullable<ButtonProps['variant']>>(${JSON.stringify(variant)});\n  const [size] = useState<NonNullable<ButtonProps['size']>>(${JSON.stringify(size)});\n  const [loading] = useState(${loading});\n${disabledState}\n  const [count, setCount] = useState(${count});`,`    <Row>\n      <Button variant={variant} size={size} loading={loading} disabled={disabled} onClick={() => setCount(current => current + 1)}>계속하기</Button>\n      <p className="text-g-small text-g-soft">{count}번 실행</p>\n    </Row>`);
  else if(page==='List')code=snapshot(detail.imports,`  const [items] = useState<Array<{ id: string; text: string }>>(${JSON.stringify(listItems)});\n  const [divider] = useState(${listDivider});`,`    <div className="grid gap-4">\n      <List aria-label="메모 목록" divider={divider}>\n        {items.map(item => (\n          <ListItem key={item.id} data-item-id={item.id}>\n            <span className="min-w-0 flex-1">{item.text}</span>\n          </ListItem>\n        ))}\n      </List>\n      {items.length === 0 && <p className="text-g-small text-g-soft">아직 메모가 없습니다.</p>}\n    </div>`);
  else if(page==='ListItem')code=snapshot(detail.imports,`  const id = useId();
  const [copy] = useState<{ title: string; description: string }>(${JSON.stringify(listItemCopy)});
  const [showDescription] = useState(${listItemShowDescription});
  const [checked, setChecked] = useState(${listItemChecked});
  const [actionCount, setActionCount] = useState(${listItemActionCount});`,`    <div className="grid gap-4 min-w-0">
      <List aria-label="선택과 보조 액션이 있는 메모">
        <ListItem data-item-id="memo">
          <div className="grid gap-2 min-w-0 w-full">
            <h3 className="font-medium">{copy.title}</h3>
            {showDescription && <p className="text-g-soft leading-7">{copy.description}</p>}
          </div>
          <label htmlFor={id} className="inline-flex min-h-11 items-center gap-2">
            <input id={id} type="checkbox" name="memo" value="memo" checked={checked} onChange={event => setChecked(event.target.checked)} /> 이 메모 선택
          </label>
          <Button type="button" variant="secondary" onClick={() => setActionCount(current => current + 1)}>보조 액션 실행</Button>
        </ListItem>
      </List>
      <p role="status" className="text-g-small text-g-soft">선택: {checked ? '선택됨' : '선택 안 됨'} · 보조 액션: {actionCount}번 실행</p>
    </div>`);
  else if(page==='Input')code=snapshot("import { Input } from './gyeol/primitives/input';\nimport { Button } from './gyeol/primitives/button';\nimport { Row } from './gyeol/primitives/layout';",`  const defaults = ${JSON.stringify(inputDefaults)};
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();
  const [value, setValue] = useState(${JSON.stringify(value)});
  const [disabled, setDisabled] = useState(${disabled});
  const [readOnly, setReadOnly] = useState(${readOnly});
  const [required, setRequired] = useState(${required});
  // 비제어 입력의 편집 값은 DOM 소유입니다. 현재 Live 값: ${JSON.stringify(uncontrolledValue)}
  // defaultValue는 편집 값으로 바꾸지 않습니다. 복사한 예제는 최초 기본값에서 시작합니다.
  const [uncontrolledValue, setUncontrolledValue] = useState(defaults.uncontrolled);
  const [submission, setSubmission] = useState<string | null>(${JSON.stringify(inputSubmission)});
  const reset = () => {
    setValue(defaults.controlled);
    setUncontrolledValue(defaults.uncontrolled);
    setDisabled(false);
    setReadOnly(false);
    setRequired(false);
    setSubmission(null);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmission(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
  };`,`    <div className="grid gap-4">
      <Button type="button" variant="quiet" size="small" onClick={() => formRef.current?.reset()}>Reset</Button>
      <form ref={formRef} onReset={reset} onSubmit={submit} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor={id + '-controlled'} className="text-g-small">제어 입력 (value + onChange)</label>
          <Input id={id + '-controlled'} name="controlled" value={value} onChange={event => setValue(event.target.value)} readOnly={readOnly} required={required} disabled={disabled} />
          <p className="text-g-small text-g-soft">현재 제어 값: {JSON.stringify(value)}</p>
        </div>
        <div className="grid gap-2">
          <label htmlFor={id + '-uncontrolled'} className="text-g-small">비제어 입력 (defaultValue)</label>
          <Input id={id + '-uncontrolled'} name="uncontrolled" defaultValue={defaults.uncontrolled} onChange={event => setUncontrolledValue(event.target.value)} readOnly={readOnly} required={required} disabled={disabled} />
          <p className="text-g-small text-g-soft">현재 비제어 값: {JSON.stringify(uncontrolledValue)} · 최초 defaultValue: {JSON.stringify(defaults.uncontrolled)}</p>
        </div>
        <Row><Button type="submit">FormData 제출</Button><Button type="reset" variant="secondary">Native form reset</Button></Row>
        <p role="status" className="text-g-small text-g-soft">{submission === null ? '제출하면 name별 값이 표시됩니다. Disabled 입력은 제출에서 제외됩니다.' : '제출 결과: ' + submission}</p>
      </form>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex gap-2 items-center"><input type="checkbox" checked={disabled} onChange={event => setDisabled(event.target.checked)} /> Disabled</label>
        <label className="flex gap-2 items-center"><input type="checkbox" checked={readOnly} onChange={event => setReadOnly(event.target.checked)} /> Read only</label>
        <label className="flex gap-2 items-center"><input type="checkbox" checked={required} onChange={event => setRequired(event.target.checked)} /> Required</label>
        <label className="grid gap-2 text-g-small">Example value<Input value={value} onChange={event => setValue(event.target.value)} /></label>
      </div>
    </div>`);
  else if(page==='TextField')code=snapshot("import { TextField } from './gyeol/components/text-field';",`  const [value, setValue] = useState(${JSON.stringify(value)});\n${disabledState}`,`    <TextField label="제목" value={value} onValueChange={setValue} disabled={disabled} clearable />`);
  else if(page==='Select')code=snapshot("import { Select } from './gyeol/primitives/select';",`  const [selected, setSelected] = useState(${JSON.stringify(selected)});\n${disabledState}\n  const options = ${JSON.stringify(options)};`,`    <Select label="선택 예제" value={selected} onValueChange={setSelected} disabled={disabled} options={options} />`);
  else if(page==='Tabs')code=snapshot("import { Tabs, TabsList, TabsTrigger, TabsContent } from './gyeol/primitives/tabs';",`  const [tab, setTab] = useState(${JSON.stringify(tab)});\n${disabledState}`,`    <Tabs value={tab} onValueChange={setTab}>\n      <TabsList aria-label="예제 탭">\n        <TabsTrigger value="one">첫 화면</TabsTrigger>\n        <TabsTrigger value="two" disabled={disabled}>다음 화면</TabsTrigger>\n      </TabsList>\n      <TabsContent value="one" className="mt-4">차분하게 시작하세요.</TabsContent>\n      <TabsContent value="two" className="mt-4">다음 단계로 이어 갑니다.</TabsContent>\n    </Tabs>`);
  else if(page==='Dialog')code=snapshot("import { Button } from './gyeol/primitives/button';\nimport { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from './gyeol/primitives/dialog';",`  const [open, setOpen] = useState(${open});\n  const dialogReturnRef = useRef<HTMLButtonElement>(null);\n  const [disabled, setDisabled] = useState(${disabled});\n  const reset = () => { setOpen(false); setDisabled(false); };`,`    <>\n    <Button ref={dialogReturnRef} variant="quiet" size="small" onClick={reset}>Reset</Button>\n    <Dialog open={open} onOpenChange={setOpen}>\n      <DialogTrigger asChild><Button disabled={disabled}>안내 열기</Button></DialogTrigger>\n      <DialogContent returnFocusRef={disabled ? dialogReturnRef : undefined}>\n        <DialogTitle>한 걸음씩</DialogTitle>\n        <DialogDescription>내용을 확인하고 다음 작업으로 이어 가세요.</DialogDescription>\n        <DialogClose asChild><Button>확인</Button></DialogClose>\n        <Button variant="quiet" onClick={reset}>Reset example</Button>\n      </DialogContent>\n    </Dialog>\n    </>`);
 }
 return <div className="grid gap-7"><section aria-label="Live example" className="grid gap-4 border-0 border-y border-solid border-g-line py-8"><div className="flex items-center justify-between gap-3"><h2 className="text-g-small text-g-soft font-medium">LIVE EXAMPLE</h2><Button ref={page==='Dialog'?dialogReturnRef:undefined} variant="quiet" size="small" onClick={reset}>Reset</Button></div>{live}</section><Tabs value={panel} onValueChange={setPanel}><TabsList aria-label="예제 설명"><TabsTrigger value="variant">Variant</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger><TabsTrigger value="docs">Docs</TabsTrigger></TabsList><TabsContent value="variant" forceMount={page==='Input'||page==='List'||page==='ListItem'?true:undefined} hidden={page==='Input'||page==='List'||page==='ListItem'?panel!=='variant':undefined} className="mt-5"><div className="flex flex-wrap items-center gap-4">{page==='Button' && <><Select label="Button variant" value={variant} onValueChange={v=>setVariant(v as NonNullable<ButtonProps['variant']>)} options={[{value:'primary',label:'Primary'},{value:'secondary',label:'Secondary'},{value:'quiet',label:'Quiet'}]}/><Select label="Button size" value={size} onValueChange={v=>setSize(v as NonNullable<ButtonProps['size']>)} options={[{value:'small',label:'Small'},{value:'medium',label:'Medium'}]}/><label className="flex gap-2 items-center"><input type="checkbox" checked={loading} onChange={event=>setLoading(event.target.checked)}/> Loading</label></>}{page==='List'&&<div className="grid gap-4 min-w-0 w-full">
 <Row><Button variant="secondary" onClick={()=>setListItems(listDefaults.items)}>짧은 목록</Button><Button variant="secondary" onClick={()=>setListItems(longListItems)}>긴 목록</Button><Button variant="secondary" onClick={()=>setListItems([])}>빈 목록</Button></Row>
 <label className="inline-flex min-h-11 gap-2 items-center"><input type="checkbox" checked={listDivider} onChange={event=>setListDivider(event.target.checked)}/> Divider</label>
 {listItems.map((item,index)=><label key={item.id} className="grid gap-2 min-w-0 text-g-small">항목 {index+1} 내용<Input value={item.text} onChange={event=>setListItems(current=>current.map(entry=>entry.id===item.id?{...entry,text:event.target.value}:entry))}/></label>)}
 <p className="text-g-small text-g-soft">내용은 owner state입니다. 항목 수가 0이면 안내를 목록 밖에 표시합니다. 내용이 빈 문자열인 항목도 하나의 li로 유지합니다.</p>
 </div>}{page==='ListItem'&&<div className="grid gap-4 min-w-0 w-full">
 <Row><Button variant="secondary" onClick={()=>setListItemCopy({title:listItemDefaults.title,description:listItemDefaults.description})}>짧은 내용</Button><Button variant="secondary" onClick={()=>setListItemCopy(longListItemCopy)}>긴 내용</Button></Row>
 <label className="grid gap-2 min-w-0 text-g-small">제목<Input value={listItemCopy.title} onChange={event=>setListItemCopy(current=>({...current,title:event.target.value}))}/></label>
 <label className="grid gap-2 min-w-0 text-g-small">설명<Input value={listItemCopy.description} onChange={event=>setListItemCopy(current=>({...current,description:event.target.value}))}/></label>
 <label className="inline-flex min-h-11 items-center gap-2"><input type="checkbox" checked={listItemShowDescription} onChange={event=>setListItemShowDescription(event.target.checked)}/> 설명 표시</label>
 <p className="text-g-small text-g-soft">정보는 전체 폭을 쓰고 선택과 액션은 다음 줄에 이어집니다. 긴 내용에는 공백 없는 식별자가 포함됩니다. 선택은 Live의 checkbox로 바꾸며 보조 액션은 선택을 바꾸지 않습니다.</p>
 </div>}{detail && page!=='List' && page!=='ListItem' && <label className="flex gap-2 items-center"><input type="checkbox" checked={disabled} onChange={event=>setDisabled(event.target.checked)}/> Disabled</label>}{page==='Input'&&<><label className="flex gap-2 items-center"><input type="checkbox" checked={readOnly} onChange={event=>setReadOnly(event.target.checked)}/> Read only</label><label className="flex gap-2 items-center"><input type="checkbox" checked={required} onChange={event=>setRequired(event.target.checked)}/> Required</label></>}{(page==='Input'||page==='TextField')&&<label className="grid gap-2 text-g-small">Example value<Input value={value} onChange={event=>setValue(event.target.value)}/></label>}{page==='Select'&&<Select label="Example selection" value={selected} onValueChange={setSelected} options={options}/>} {page==='Tabs'&&<Select label="Example tab" value={tab} onValueChange={setTab} options={[{value:'one',label:'첫 화면'},{value:'two',label:'다음 화면'}]}/>} {page==='Dialog'&&<label className="flex gap-2 items-center"><input type="checkbox" checked={open} onChange={event=>setOpen(event.target.checked)}/> Example open</label>}<p className="text-g-small text-g-soft">{page==='Input'?'두 입력에 옵션이 함께 적용됩니다. Example value는 제어 입력의 owner state만 바꿉니다. 비제어 값은 Live에서 직접 편집하세요.':'위의 실제 예제에서 값을 바꾸면 Code에도 반영됩니다.'}</p></div></TabsContent><TabsContent value="code" forceMount={detail?true:undefined} hidden={detail?panel!=='code':undefined} className="mt-5"><pre className="whitespace-pre-wrap break-words text-g-small bg-g-muted p-4 rounded-g-control"><code>{code}</code></pre></TabsContent><TabsContent value="docs" className="mt-5">{detail?<div className="grid gap-5"><section className="grid gap-2"><h3 className="font-medium">API / ref / form</h3><p className="leading-7 text-g-soft">{references[page]}</p><p className="leading-7 text-g-soft">{detail.form}</p></section><section className="grid gap-2"><h3 className="font-medium">Local imports / dependencies</h3><code className="whitespace-pre-wrap break-words text-g-small">{detail.imports}</code><p className="leading-7 text-g-soft">{detail.closure} 공통 helper는 clsx 2.1.1과 tailwind-merge 3.7.0을 사용합니다. React / React DOM은 호스트 의존성입니다. {detail.dependency} hangyeol-core는 설치 도구용 devDependency이며 UI runtime에서 import하지 않습니다.</p></section><p className="leading-7 text-g-soft">{page==='ListItem'?'Live / Variant / Code는 같은 제목·설명·설명 표시·선택·액션 횟수를 사용합니다. 짧은 내용 / 긴 내용은 내용만 바꿉니다. Code는 현재 state를 초기값으로 둔 실행 가능한 Live 스냅샷이며 native checkbox와 Button의 콜백이 실제 state를 변경합니다. 복사한 Code에는 Variant 편집 도구와 Reset을 포함하지 않습니다. 설명 탭 전환과 Reset은 Live의 ul/li를 다시 mount하지 않습니다. Reset은 내용·설명 표시·선택·액션 피드백을 기본값으로 복원하고 현재 설명 탭을 유지합니다. 페이지를 떠났다 돌아오면 기본값에서 시작합니다.':page==='List'?'Live와 Variant는 같은 항목·divider state를 사용합니다. 짧은 목록 / 긴 목록 / 빈 목록은 항목 데이터만 바꾸고 Divider는 유지합니다. 항목 편집은 id를 유지합니다. Code는 현재 항목과 divider를 초기값으로 둔 실행 가능한 Live 스냅샷이며 문자열은 JSX가 아닌 JSON 데이터로 넣습니다. 복사한 Code에는 Variant 편집 도구를 포함하지 않습니다. Variant/Code/Docs 전환과 Reset은 Live의 ul을 다시 mount하지 않습니다. Reset은 항목과 divider만 기본값으로 되돌리고 현재 설명 탭을 유지합니다. 페이지를 떠났다 돌아오면 기본 예제로 시작합니다.':page==='Input'?'Live의 두 입력은 제어/비제어 모드를 바꾸지 않는 별도 DOM 노드입니다. 옵션과 Variant/Code/Docs 전환은 값을 덮어쓰거나 다시 mount하지 않습니다. Variant도 숨긴 채 유지합니다. Code에는 현재 제어 값·옵션과 실행 가능한 imports/state/submit/reset 핸들러를 표시합니다. 비제어 편집 값은 주석과 Live 피드백으로 표시하며, 복사한 예제는 고정 defaultValue에서 시작합니다. Reset은 현재 설명 탭을 유지하고 두 값·옵션·제출 결과를 초기화합니다. 다른 페이지로 이동했다 돌아오면 기본 예제로 시작합니다.':<>Live와 Variant는 같은 owner state를 사용합니다. Code는 현재 상태를 초기값으로 둔 실행 가능한 Live 예제입니다. 설명 탭 전환은 Live를 다시 mount하지 않습니다. Reset은 예제 props/state만 기본값으로 돌리고 현재 설명 탭을 유지합니다. 다른 페이지로 이동했다가 돌아오면 예제는 기본값으로 새로 시작합니다. 로컬 소스·helper·theme·palette는 바꾸지 않습니다.</>}</p></div>:<p className="leading-7 text-g-soft">{references[page]}</p>}</TabsContent></Tabs></div>;
}
function Foundations(){return <div className="grid gap-8"><p className="text-g-soft leading-7">한결디자인은 정보와 행동의 관계를 읽기 쉽게 만드는 디자인 시스템입니다. 따뜻한 바탕, 분명한 잉크, 절제된 올리브 액션을 사용합니다. Pretendard와 여유 있는 행간으로 긴 한국어 문장을 편하게 읽습니다.</p><section className="grid grid-cols-2 gap-4 sm:grid-cols-4"><div className="bg-g-surface border border-solid border-g-line p-4"><p className="font-medium">Surface</p><p className="text-g-small text-g-soft">내용의 자리</p></div><div className="bg-g-muted p-4"><p className="font-medium">Muted</p><p className="text-g-small text-g-soft">보조 영역</p></div><div className="bg-g-action text-g-on-action p-4"><p className="font-medium">Action</p><p className="text-g-small">중요한 다음 행동</p></div><div className="border border-solid border-g-line p-4"><p className="text-g-danger font-medium">Error</p><p className="text-g-small text-g-soft">복구할 수 있는 안내</p></div></section><div className="grid gap-3"><h2 className="text-g-title font-semibold">여백으로 구분하고, 글로 설명합니다.</h2><p className="text-g-body">본문 16px · 작은 설명 14px · 제목 32px</p><p className="text-g-small text-g-soft">44px 이상의 조작 영역, 별도의 focus outline과 error border. Root/중첩 테마는 portal에도 이어집니다.</p></div><Button>다음 작업으로</Button></div>;}
function Overview(){
 return <div className="grid gap-8">
  <p className="text-g-body leading-7 text-g-soft">필수 개발 도구는 core로 설치하고, UI 소스는 내 프로젝트에서 직접 수정합니다.</p>
  <div className="flex flex-wrap items-center gap-4">
   <a href="https://github.com/orderthan31/design-system/blob/f5138d67c86f965747ba2d1b187a69c008caf68b/docs/source-installation.md#core11-quickstart" className="text-g-action underline underline-offset-4">설치 안내</a>
   <a href={pageHref('Button')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-g-control border border-solid border-g-line bg-g-surface px-g-control py-2 text-g-body font-medium text-g-ink leading-6 no-underline transition-colors hover:bg-g-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus">컴포넌트 문서</a>
   <a href={pageHref('TaskExample')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-g-control border border-solid border-transparent bg-transparent px-g-control py-2 text-g-body font-medium text-g-soft leading-6 no-underline transition-colors hover:bg-g-muted hover:text-g-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus">대표 소비 예제</a>
  </div>
  <section aria-label="소스 설치와 편집" className="grid gap-7">
   <div className="grid gap-2"><h2 className="text-lg font-semibold">개발 도구는 core로</h2><p className="leading-7 text-g-soft"><code>hangyeol-core</code>를 버전이 고정된 devDependency로 설치합니다. 프로젝트의 로컬 <code>node_modules/.bin/hangyeol</code> 명령으로 초기 설정을 만들고, 필요한 컴포넌트 소스만 선택해 추가합니다.</p></div>
   <div className="grid gap-2"><h2 className="text-lg font-semibold">UI는 내 프로젝트의 소스로</h2><p className="leading-7 text-g-soft">선택한 컴포넌트와 공통 helper, theme은 프로젝트에 복사되는 편집 가능한 로컬 파일입니다. 컴포넌트 문서에서 공개 API를 확인하고, 프로젝트에 맞게 소스를 직접 수정하세요.</p></div>
   <div className="grid gap-2"><h2 className="text-lg font-semibold">팔레트도 직접 편집</h2><p className="leading-7 text-g-soft">제공된 팔레트의 값을 바꾸거나 새 팔레트를 추가할 수 있습니다. light와 dark 테마, 의미와 상태를 나타내는 토큰도 프로젝트에서 관리합니다.</p></div>
  </section>
  <p className="text-g-small leading-6 text-g-soft">현재 설치 안내는 준비된 캐시(prepared-cache)와 설치 스크립트 비활성화(scripts-off)를 사용한 검증 범위를 설명합니다. 안내를 읽으려면 저장소 접근 권한이 필요합니다.</p>
 </div>;
}
const menuGroups=['Introduction / foundations','Components','Examples / verification'] as const;
function menuGroup(page:DocsPage):typeof menuGroups[number]{
 if(page==='Overview'||page==='Foundations')return 'Introduction / foundations';
 if(page==='TaskExample'||page==='Customization'||page==='Behavior')return 'Examples / verification';
 return 'Components';
}
export default function App(){
 const [page,setPage]=useState<DocsPage>(()=>parsePageHash(typeof window==='undefined'?'':window.location.hash));
 const [search,setSearch]=useState(''),[mode,setMode]=useState<'light'|'dark'>('light');
 // This is a client-rendered app. Without matchMedia, keep the full desktop menu readable.
 // 64rem is the existing Tailwind lg layout boundary, also used by the CSS grid below.
 const [desktop,setDesktop]=useState(()=>typeof window==='undefined'||typeof window.matchMedia!=='function'||window.matchMedia('(min-width: 64rem)').matches);
 const [menuOpen,setMenuOpen]=useState(false),menuId=useId();
 const triggerRef=useRef<HTMLButtonElement>(null),closeRef=useRef<HTMLButtonElement>(null),searchRef=useRef<HTMLInputElement>(null),menuRef=useRef<HTMLDivElement>(null),headingRef=useRef<HTMLHeadingElement>(null);
 const pendingFocus=useRef<'search'|'trigger'|{page:DocsPage}|null>(null);
 const visiblePages=docsPages.filter(p=>p.toLowerCase().includes(search.toLowerCase()));
 const closeMenu=(target:'trigger'|{page:DocsPage})=>{pendingFocus.current=target;setMenuOpen(false);};
 const onRouteClick=(event:MouseEvent<HTMLDivElement>)=>{
  if(desktop||!menuOpen||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const anchor=event.target instanceof Element?event.target.closest('a'):null;
  if(!anchor||!event.currentTarget.contains(anchor)||anchor.hasAttribute('download')||(anchor.target&&anchor.target!=='_self'))return;
  const destination=docsPages.find(name=>pageHref(name)===anchor.getAttribute('href'));
  if(destination)closeMenu({page:destination});
  // Native anchors own navigation. Never prevent the link's default action or setPage here.
 };
 useEffect(()=>{
  const syncPage=()=>{
   const next=parsePageHash(window.location.hash);
   // Replace only the current fragment: preserve path, query, state and history length.
   // This also canonicalizes encoded valid pages; invalid/empty hashes become #Overview.
   if(window.location.hash!==pageHref(next))window.history.replaceState(window.history.state,'',pageHref(next));
   setPage(next);
  };
  window.addEventListener('hashchange',syncPage);
  window.addEventListener('popstate',syncPage);
  syncPage();
  return()=>{
   window.removeEventListener('hashchange',syncPage);
   window.removeEventListener('popstate',syncPage);
  };
 },[]);
 useEffect(()=>{
  if(typeof window.matchMedia!=='function')return;
  const media=window.matchMedia('(min-width: 64rem)');
  let previous=desktop;
  const syncViewport=()=>{
   const next=media.matches;
   if(next===previous)return;
   previous=next;
   const active=document.activeElement;
   if(!next&&menuRef.current?.contains(active))pendingFocus.current='trigger';
   else if(next&&(active===triggerRef.current||active===closeRef.current))pendingFocus.current='search';
   setDesktop(next);setMenuOpen(false);
  };
  media.addEventListener('change',syncViewport);
  syncViewport(); // Reconcile a breakpoint change between the initial read and subscription.
  return()=>media.removeEventListener('change',syncViewport);
 },[]);
 useEffect(()=>{
  const target=pendingFocus.current;
  // Wait for native URL navigation and the destination render before consuming focus.
  if(target&&typeof target==='object'&&(page!==target.page||window.location.hash!==pageHref(target.page)))return;
  pendingFocus.current=null;
  if(target&&typeof target==='object')headingRef.current?.focus();
  else if(target==='trigger')(desktop?searchRef.current:triggerRef.current)?.focus();
  else if(target==='search')(desktop||menuOpen?searchRef.current:triggerRef.current)?.focus();
 },[desktop,menuOpen,page]);
 return <Theme mode={mode} className="min-h-screen"><div className="mx-auto grid max-w-7xl lg:grid-cols-5" onClick={onRouteClick}>
  <aside className="border-0 border-b border-solid border-g-line min-w-0 p-5 lg:col-span-1 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-7">
   <div className="flex items-center justify-between gap-2">
    <a href={pageHref('Overview')} className="no-underline text-xl font-semibold tracking-tight">한결디자인</a>
    <Button variant="quiet" size="small" aria-label="테마 변경" onClick={()=>setMode(m=>m==='light'?'dark':'light')}>{mode==='light'?'◐':'◑'}</Button>
   </div>
   <div className="mt-5 grid gap-3">
    <p className="text-g-small text-g-soft">현재 위치: {page}</p>
    {!desktop&&<button ref={triggerRef} type="button" aria-label="문서 메뉴" aria-controls={menuId} aria-expanded={menuOpen} onClick={()=>{if(menuOpen)closeMenu('trigger');else{pendingFocus.current='search';setMenuOpen(true);}}} className="inline-flex min-h-11 items-center justify-between gap-3 rounded-g-control border border-solid border-g-line bg-g-surface px-3 py-2 text-g-small font-medium text-g-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus">문서 메뉴 <span>{menuOpen?'닫기':'열기'}</span></button>}
   </div>
   <div ref={menuRef} id={menuId} hidden={!desktop&&!menuOpen} className="mt-6" onKeyDown={event=>{if(event.key==='Escape'&&!desktop&&menuOpen){event.preventDefault();closeMenu('trigger');}}}>
    {!desktop&&<div className="mb-3 flex justify-end"><button ref={closeRef} type="button" aria-label="문서 메뉴 닫기" onClick={()=>closeMenu('trigger')} className="inline-flex min-h-11 items-center justify-center rounded-g-control border border-solid border-transparent bg-transparent px-3 py-2 text-g-small font-medium text-g-soft hover:bg-g-muted hover:text-g-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus">닫기</button></div>}
    <Input ref={searchRef} aria-label="문서 검색" placeholder="Search docs" value={search} onChange={event=>setSearch(event.target.value)}/>
    <nav aria-label="API menu" className="mt-5 grid gap-6">
     {menuGroups.map((group,index)=>{
      const entries=visiblePages.filter(name=>menuGroup(name)===group);
      if(!entries.length)return null;
      return <section key={group} aria-labelledby={`${menuId}-group-${index}`} className="grid gap-2">
       <h2 id={`${menuId}-group-${index}`} className="text-g-small font-medium text-g-soft">{group}</h2>
       <ul className="m-0 grid list-none gap-1 p-0">{entries.map(name=><li key={name} className="grid"><a href={pageHref(name)} aria-current={page===name?'page':undefined} className={page===name?'inline-flex min-h-11 items-center justify-start gap-2 rounded-g-control border border-solid border-g-line bg-g-surface px-3 py-2 text-g-small font-medium text-g-ink leading-6 no-underline transition-colors hover:bg-g-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus':'inline-flex min-h-11 items-center justify-start gap-2 rounded-g-control border border-solid border-transparent bg-transparent px-3 py-2 text-g-small font-medium text-g-soft leading-6 no-underline transition-colors hover:bg-g-muted hover:text-g-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus'}>{name}</a></li>)}</ul>
      </section>;
     })}
     {!visiblePages.length&&<p role="status" className="text-g-small text-g-soft">일치하는 문서가 없습니다.</p>}
    </nav>
   </div>
   <p className="mt-8 text-g-small text-g-soft hidden lg:block">작업에 필요한 만큼.<br/>소스는 당신의 프로젝트에.</p>
  </aside>
  <main className="min-w-0 px-5 py-8 sm:px-10 lg:col-span-4 lg:px-14 lg:py-12">
   <div className="mb-8 flex items-baseline justify-between gap-3"><h1 ref={headingRef} tabIndex={-1} className="text-g-title font-semibold tracking-tight focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus">{page==='Overview'?'한결디자인':page}</h1><span className="text-g-small text-g-soft">한결디자인 · 01</span></div>
   {page==='Overview'?<Overview/>:page==='TaskExample'?<TaskExample/>:page==='Foundations'?<Foundations/>:page==='Customization'?<div className="grid gap-6"><p className="text-g-soft">이 페이지는 설치된 소스의 className 병합 계약을 검증하는 명시적인 예외입니다. 일반 문서는 공개 variant/size를 사용합니다.</p><Customization/></div>:page==='Behavior'?<BehaviorProofs/>:<ExampleWorkbench key={page} page={page}/>}
  </main>
 </div></Theme>;
}
