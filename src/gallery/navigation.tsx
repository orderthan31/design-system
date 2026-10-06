import React,{useState} from 'react';
import {Input,Stack} from '../index';
import {galleryRegistry,searchComponents,componentHash,type GalleryEntry,type AtomicLayer} from './registry';
const layers:AtomicLayer[]=['Atoms','Molecules','Organisms'];
export function GalleryNavigation({selected,onNavigate}:{selected?:string;onNavigate:(hash:string)=>void}) {
 const [query,setQuery]=useState('');
 const entries=(query.trim()?searchComponents(query):[...galleryRegistry]).slice().sort((a,b)=>a.name.localeCompare(b.name,'en'));
 const link=(entry:GalleryEntry)=><a key={entry.id} href={componentHash(entry.id)} aria-current={selected===entry.id?'page':undefined} onClick={event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();onNavigate(componentHash(entry.id));}}>{entry.name}</a>;
 return <nav className="gallery-nav" aria-label="컴포넌트 탐색"><Stack>
  <Input type="search" aria-label="컴포넌트 검색" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search components…"/>
  <div className="gallery-nav-pages"><a href="#Overview" onClick={event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();onNavigate('#Overview');}}>Overview</a><a href="#Foundations" onClick={event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();onNavigate('#Foundations');}}>Foundations</a></div>
  {query.trim()?<section><p role="status">검색 결과 {entries.length}개</p>{entries.map(link)}</section>:layers.map(layer=><section key={layer}><h2>{layer}</h2>{entries.filter(entry=>entry.atomic===layer).map(link)}</section>)}
 </Stack></nav>;
}
