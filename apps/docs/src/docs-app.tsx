import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { Theme } from './gyeol/foundation/theme';
import { BrandCI } from './brand-ci';
import { Button } from './gyeol/primitives/button';
import { Input } from './gyeol/primitives/input';
import { Icon } from './gyeol/primitives/icon';
import { Moon, Sun } from 'lucide-react';
import { Overview, GettingStarted, Customization } from './visitor-pages';
import { Foundations, FoundationPage, foundationNames, foundationLabels, foundationDescriptions, type FoundationName } from './foundation-pages';
import { ComponentPage, CompositionExamples, componentDescriptions } from './component-pages';
import { ControlPage, controlNames, controlDescriptions, type ControlName } from './control-pages';
import { InputPage, inputNames, inputDescriptions, type InputName } from './input-pages';
import { SelectionPage, selectionNames, selectionDescriptions, type SelectionName } from './selection-pages';
import { NativePage, nativeNames, nativeDescriptions, type NativeName } from './native-pages';
import { InteractionPage, interactionNames, interactionDescriptions, type InteractionName } from './interaction-pages';
import { DateDataPage, dateDataNames, dateDataDescriptions, type DateDataName } from './date-data-pages';

const components = [...(['Badge','Button','Dialog','FormSection','Input','Layout','List','ListItem','ListPanel','Row','Select','Stack','Tabs','TextField'] as const), ...controlNames, ...inputNames, ...selectionNames, ...nativeNames, ...interactionNames, ...dateDataNames].sort();
type ComponentName = typeof components[number];
const pages = ['Overview','GettingStarted','Foundations',...foundationNames,...components,'TaskExample','Customization'] as const;
type Page = typeof pages[number];
const labels: Record<Page,string> = { Overview:'소개', GettingStarted:'시작하기', Foundations:'파운데이션', TaskExample:'조합 예제', Customization:'스타일 바꾸기', ...foundationLabels, ...Object.fromEntries(components.map(name=>[name,name])) } as Record<Page,string>;
const groups = [ { name:'둘러보기', entries:['Overview','GettingStarted'] }, { name:'파운데이션', entries:['Foundations',...foundationNames] }, { name:'컴포넌트', entries:components }, { name:'함께 사용하기', entries:['TaskExample','Customization'] } ] as const;
const palettes = ['Indigo','Silver','Forest','Amber','Rose'];
const paletteLabels: Record<string,string> = {Indigo:'인디고',Silver:'실버',Forest:'포레스트',Amber:'앰버',Rose:'로즈'};
function parsePage(hash:string):Page { try { const value=decodeURIComponent(hash.slice(1)); return pages.find(page=>page===value) ?? 'Overview'; } catch { return 'Overview'; } }

export default function DocsApp() {
 const [page,setPage]=useState<Page>(()=>parsePage(window.location.hash));
 const [search,setSearch]=useState(''),[palette,setPalette]=useState('Indigo'),[mode,setMode]=useState<'light'|'dark'>('light');
 const [desktop,setDesktop]=useState(()=>window.matchMedia('(min-width: 64rem)').matches),[menuOpen,setMenuOpen]=useState(false);
 const id=useId(),triggerRef=useRef<HTMLButtonElement>(null),searchRef=useRef<HTMLInputElement>(null),headingRef=useRef<HTMLHeadingElement>(null);
 const pendingFocus=useRef<'trigger'|'search'|Page|null>(null);
 useEffect(()=>{
  const sync=()=>{ const next=parsePage(window.location.hash); if(window.location.hash!=='#'+next)window.history.replaceState(window.history.state,'','#'+next); setPage(next); };
  window.addEventListener('hashchange',sync); window.addEventListener('popstate',sync); sync();
  return()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync);};
 },[]);
 useEffect(()=>{
  const media=window.matchMedia('(min-width: 64rem)');
  const sync=()=>{setDesktop(media.matches);setMenuOpen(false);};
  media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);
 },[]);
 useEffect(()=>{
  const target=pendingFocus.current;
  if(target && target!=='trigger' && target!=='search' && target!==page)return;
  pendingFocus.current=null;
  if(target==='trigger')triggerRef.current?.focus();
  else if(target==='search')searchRef.current?.focus();
  else if(target){headingRef.current?.focus();window.scrollTo({top:0});}
 },[menuOpen,page]);
 const closeMenu=()=>{pendingFocus.current='trigger';setMenuOpen(false);};
 const navigate=(event:MouseEvent<HTMLElement>)=>{
  if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const anchor=event.target instanceof Element?event.target.closest('a'):null;
  const destination=pages.find(name=>anchor?.getAttribute('href')==='#'+name);
  if(destination){pendingFocus.current=destination;setMenuOpen(false);if(destination===page){pendingFocus.current=null;headingRef.current?.focus();window.scrollTo({top:0});}}
 };
 const query=search.trim().toLocaleLowerCase();
 const match=(name:Page)=>`${labels[name]} ${name} ${foundationDescriptions[name as FoundationName]??componentDescriptions[name as ComponentName]??controlDescriptions[name as ControlName]??inputDescriptions[name as InputName]??selectionDescriptions[name as SelectionName]??nativeDescriptions[name as NativeName]??interactionDescriptions[name as InteractionName]??dateDataDescriptions[name as DateDataName]??''}`.toLocaleLowerCase().includes(query);
 return <Theme mode={mode} palette={palette} className="docs-shell min-h-screen">
  <a href="#docs-main" className="docs-skip" onClick={event=>{event.preventDefault();document.getElementById('docs-main')?.focus();}}>본문으로 바로 가기</a>
  <header className="docs-header">
   <a href="#Overview" className="docs-brand-link" aria-label="한결디자인 소개" onClick={navigate}><BrandCI decorative/></a>
   <div className="docs-header-actions">
    <fieldset className="docs-theme-picker"><legend className="docs-visually-hidden">팔레트</legend>{palettes.map(value=><Theme key={value} mode={mode} palette={value}><label className="docs-swatch-option" title={paletteLabels[value]}><input type="radio" name={id+'-palette'} value={value} checked={palette===value} aria-label={paletteLabels[value]+' 팔레트'} onChange={()=>setPalette(value)}/><span className="docs-palette-swatch">{palette===value&&<Icon name="check" size="small"/>}</span></label></Theme>)}</fieldset>
    <Button variant="quiet" size="small" aria-label={mode==='light'?'어두운 화면으로 바꾸기':'밝은 화면으로 바꾸기'} title={mode==='light'?'어두운 화면':'밝은 화면'} onClick={()=>setMode(current=>current==='light'?'dark':'light')}>{mode==='light'?<Moon size={20} aria-hidden="true"/>:<Sun size={20} aria-hidden="true"/>}</Button>
    {!desktop&&<Button ref={triggerRef} variant="secondary" size="small" aria-label="문서 메뉴" aria-expanded={menuOpen} aria-controls={id} onClick={()=>{if(menuOpen)closeMenu();else{pendingFocus.current='search';setMenuOpen(true);}}}>메뉴</Button>}
   </div>
  </header>
  <div className="docs-layout" onClick={navigate}>
   <aside id={id} hidden={!desktop&&!menuOpen} className="docs-sidebar" onKeyDown={event=>{if(event.key==='Escape'&&!desktop){event.preventDefault();closeMenu();}}}>
    <div className="docs-search"><Input ref={searchRef} aria-label="문서 검색" placeholder="이름이나 용도로 찾기" value={search} onChange={event=>setSearch(event.target.value)}/>{!desktop&&<Button variant="quiet" size="small" onClick={closeMenu}>닫기</Button>}</div>
    <nav aria-label="문서 메뉴" className="docs-navigation">
     {groups.map(group=>{const entries=group.entries.filter(name=>match(name));return entries.length>0&&<section key={group.name}><h2 className="docs-nav-heading">{group.name}</h2><ul>{entries.map(name=><li key={name}><a href={'#'+name} aria-current={page===name?'page':undefined}>{labels[name]}</a></li>)}</ul></section>;})}
     {!pages.some(match)&&<p role="status" className="text-g-small text-g-soft">일치하는 문서가 없습니다.</p>}
    </nav>
   </aside>
   <main id="docs-main" tabIndex={-1} className="docs-main">
    <div className="docs-page-heading"><p className="text-g-small text-g-soft">{components.includes(page as ComponentName)?'컴포넌트':page==='TaskExample'||page==='Customization'?'함께 사용하기':page==='Foundations'||foundationNames.includes(page as FoundationName)?'파운데이션':'한결디자인'}</p><h1 ref={headingRef} tabIndex={-1}>{labels[page]}</h1></div>
    {page==='Overview'?<Overview/>:page==='GettingStarted'?<GettingStarted/>:page==='Foundations'?<Foundations/>:foundationNames.includes(page as FoundationName)?<FoundationPage key={page} name={page as FoundationName}/>:page==='TaskExample'?<CompositionExamples/>:page==='Customization'?<Customization/>:dateDataNames.includes(page as DateDataName)?<DateDataPage key={page} name={page as DateDataName}/>:interactionNames.includes(page as InteractionName)?<InteractionPage key={page} name={page as InteractionName}/>:nativeNames.includes(page as NativeName)?<NativePage key={page} name={page as NativeName}/>:selectionNames.includes(page as SelectionName)?<SelectionPage key={page} name={page as SelectionName}/>:inputNames.includes(page as InputName)?<InputPage key={page} name={page as InputName}/>:controlNames.includes(page as ControlName)?<ControlPage key={page} name={page as ControlName}/>:<ComponentPage key={page} name={page as ComponentName}/>}
    <footer className="docs-footer">한결디자인</footer>
   </main>
  </div>
 </Theme>;
}
