export type AtomicLayer='Foundations'|'Atoms'|'Molecules'|'Organisms'|'Templates';
export type ComponentGroup='inputs'|'navigation'|'data'|'feedback'|'overlays'|'layout'|'foundations';
export type GalleryEntry={id:string;name:string;label:string;atomic:AtomicLayer;group:ComponentGroup;aliases?:readonly string[]};
export type GalleryRoute={kind:'component';id:string}|{kind:'page';page:'Overview'|AtomicLayer;invalid?:true};
const entry=(name:string,label:string,atomic:AtomicLayer,group:ComponentGroup,aliases?:readonly string[]):GalleryEntry=>({id:name.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase(),name,label,atomic,group,aliases});
export const galleryRegistry:readonly GalleryEntry[]=[
 entry('BottomCTA','하단 작업','Organisms','layout'),
 entry('Slider','슬라이더','Atoms','inputs'),entry('Rating','별점','Molecules','inputs'),
 entry('ProgressStepper','단계 진행','Molecules','feedback'),entry('Result','결과','Organisms','feedback'),
 entry('SegmentedControl','분할 선택','Molecules','inputs'),
 entry('TextField','텍스트 필드','Molecules','inputs'),
 entry('ListRow','목록 행','Molecules','data'),
 entry('ListHeader','목록 제목','Molecules','data'),
 entry('ListFooter','목록 하단','Molecules','data'),
 entry('Button','버튼','Atoms','inputs'),entry('IconButton','아이콘 버튼','Atoms','inputs'),
 entry('Input','입력','Atoms','inputs'),entry('Textarea','여러 줄 입력','Atoms','inputs'),entry('Select','선택','Atoms','inputs'),entry('Checkbox','체크박스','Atoms','inputs'),
 entry('FormField','폼 필드','Molecules','inputs'),entry('PasswordInput','비밀번호','Molecules','inputs'),
 entry('NumberInput','숫자 입력','Molecules','inputs',['Stepper']),entry('CurrencyInput','금액 입력','Molecules','inputs'),entry('PhoneInput','전화번호','Molecules','inputs'),entry('EmailInput','이메일','Molecules','inputs'),
 entry('Combobox','검색 선택 · 자동완성','Molecules','inputs',['Autocomplete']),entry('MultiSelect','복수 선택','Molecules','inputs'),entry('RadioGroup','라디오 그룹','Molecules','inputs'),entry('CheckboxGroup','체크 그룹','Molecules','inputs'),entry('Switch','스위치','Atoms','inputs'),entry('FileInput','파일 입력','Molecules','inputs'),entry('AddressField','주소','Organisms','inputs'),
 entry('DatePicker','날짜 선택','Organisms','inputs'),entry('DateRangePicker','기간 선택','Organisms','inputs'),entry('MonthPicker','월 선택','Organisms','inputs'),entry('TimeInput','시간 입력','Molecules','inputs'),entry('DateTimeInput','날짜와 시간','Organisms','inputs'),
 entry('SearchField','검색 입력','Molecules','inputs'),
 entry('GNB','전체 탐색','Organisms','navigation'),entry('LNB','영역 탐색','Organisms','navigation'),entry('Breadcrumb','경로','Molecules','navigation'),entry('Tabs','탭','Molecules','navigation'),entry('Menu','메뉴','Molecules','navigation'),
 entry('BottomSheet','바텀시트','Organisms','overlays'),entry('Dialog','모달','Organisms','overlays',['Modal']),entry('Confirm','확인 모달','Organisms','overlays'),entry('Drawer','드로워','Organisms','overlays'),entry('Popover','팝오버','Molecules','overlays'),entry('Tooltip','툴팁','Molecules','overlays'),
 entry('Table','표','Organisms','data'),entry('DataTable','데이터 테이블','Organisms','data'),entry('Pagination','페이지 탐색','Molecules','data'),entry('List','목록','Organisms','data'),entry('ListItem','목록 항목','Molecules','data'),
 entry('Badge','배지','Atoms','feedback'),entry('Alert','알림','Molecules','feedback'),entry('Progress','진행률','Atoms','feedback'),entry('Skeleton','자리 표시','Atoms','feedback'),entry('LoadingSpinner','로딩','Atoms','feedback'),entry('EmptyState','빈 결과','Organisms','feedback'),entry('ErrorState','오류 결과','Organisms','feedback'),entry('Toast','토스트','Molecules','feedback'),entry('Accordion','아코디언','Molecules','feedback'),entry('Collapse','펼침','Molecules','feedback'),
 entry('Separator','구분선','Atoms','layout'),entry('Container','컨테이너','Atoms','layout'),entry('Stack','수직 배치','Atoms','layout'),entry('Grid','격자','Atoms','layout'),entry('Shell','탐색 레이아웃','Organisms','layout'),entry('ActionGroup','동작 그룹','Molecules','layout'),entry('FormSection','폼 영역','Organisms','layout'),entry('ListPanel','목록 영역','Organisms','layout'),
 entry('FormTemplate','폼 템플릿','Templates','layout'),entry('ListTemplate','목록 템플릿','Templates','layout'),entry('FeedbackTemplate','피드백 템플릿','Templates','layout'),entry('DetailTemplate','상세 템플릿','Templates','layout'),entry('DesktopWorkspaceTemplate','PC 작업 공간','Templates','layout'),entry('MobileWorkspaceTemplate','모바일 작업 공간','Templates','layout'),
 entry('Icon','아이콘','Atoms','foundations'),entry('IconAction','아이콘 동작','Molecules','inputs')
];
export const componentHash=(id:string)=>`#/components/${encodeURIComponent(id)}`;
export function searchComponents(query:string):GalleryEntry[]{const term=query.trim().toLocaleLowerCase('ko');return galleryRegistry.filter(item=>[item.name,item.label,...(item.aliases??[])].join(' ').toLocaleLowerCase('ko').includes(term));}
export function resolveGalleryHash(hash:string):GalleryRoute{
 let value:string;try{value=decodeURIComponent(hash.replace(/^#/,''));}catch{return {kind:'page',page:'Overview',invalid:true};}
 if(!value)return {kind:'page',page:'Overview'};
 const pages=['Overview','Foundations','Atoms','Molecules','Organisms','Templates'] as const;
 const page=pages.find(item=>item===value);if(page)return {kind:'page',page};
 if(value.startsWith('/components/')){const id=value.slice('/components/'.length);const item=galleryRegistry.find(item=>item.id===id||item.name===id||item.aliases?.some(alias=>alias.toLowerCase()===id.toLowerCase()));if(item)return {kind:'component',id:item.id};}
 return {kind:'page',page:'Overview',invalid:true};
}
