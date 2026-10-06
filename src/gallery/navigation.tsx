import React,{useState} from 'react';
import {galleryRegistry,searchComponents,componentHash,type GalleryEntry,type AtomicLayer,type ComponentGroup} from './registry';
const layers:AtomicLayer[]=['Atoms','Molecules','Organisms','Templates'];
const groups:Record<ComponentGroup,string>={inputs:'입력',navigation:'탐색',data:'목록과 데이터',feedback:'상태와 피드백',overlays:'오버레이',layout:'레이아웃',foundations:'기초'};
export function GalleryNavigation({selected,onNavigate}:{selected?:string;onNavigate:(hash:string)=>void}){
 const [query,setQuery]=useState('');const [mode,setMode]=useState<'atomic'|'group'>('atomic');
 const entries=query.trim()?searchComponents(query):galleryRegistry;
 const link=(entry:GalleryEntry)=><a key={entry.id} href={componentHash(entry.id)} aria-current={selected===entry.id?'page':undefined} onClick={event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();onNavigate(componentHash(entry.id));}}><span>{entry.name}</span></a>;
 return <nav className="gallery-component-nav" aria-label="컴포넌트 탐색">
  <label className="gallery-search">컴포넌트 검색<input type="search" aria-label="컴포넌트 검색" value={query} onChange={event=>setQuery(event.target.value)} placeholder="한국어 또는 API 이름"/></label>
  <div className="gallery-nav-mode"><button type="button" aria-pressed={mode==='atomic'} onClick={()=>setMode('atomic')}>Atomic</button><button type="button" aria-pressed={mode==='group'} onClick={()=>setMode('group')}>기능군</button></div>
  {query.trim()?<><span role="status">검색 결과 {entries.length}개</span>{entries.map(link)}</>:(mode==='atomic'?layers:Object.keys(groups) as ComponentGroup[]).map(key=><details key={key} open><summary>{mode==='atomic'?key:groups[key as ComponentGroup]}</summary>{entries.filter(entry=>mode==='atomic'?entry.atomic===key:entry.group===key).map(link)}</details>)}
 </nav>;
}
