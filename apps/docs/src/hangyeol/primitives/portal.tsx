import { createContext, useContext, useRef, useCallback, useLayoutEffect, type Ref, type CSSProperties } from 'react';
import { useThemeScope } from '../foundation/theme';
// Dialog content provides an in-modal portal destination for Select.
export const PortalContext=createContext<HTMLElement|null>(null);
export function usePortalContainer(){return useContext(PortalContext);}
export function usePortalTheme(){const scope=useThemeScope();return {'data-hangyeol':'','data-theme':scope.mode,'data-palette':scope.palette};}
// Only custom properties are transported. Native styles/ref stay on the actual element.
export function usePortalRef<T extends HTMLElement>(forwarded?:Ref<T>,nativeStyle?:CSSProperties){
 const node=useRef<T|null>(null),applied=useRef(new WeakMap<T,Set<string>>()),scope=useThemeScope();
 const latest=useRef({variables:scope.variables,nativeStyle,forwarded});latest.current={variables:scope.variables,nativeStyle,forwarded};
 const attached=useRef<{element:T;ref:Ref<T>|undefined;cleanup?:()=>void}|null>(null);
 const apply=useCallback((element:T)=>{const {variables,nativeStyle:style}=latest.current;
  const own=Object.fromEntries(Object.entries(style??{}).filter(([name,value])=>name.startsWith('--')&&value!==undefined)),values={...variables,...own};
  for(const name of applied.current.get(element)??[])if(!Object.hasOwn(values,name))element.style.removeProperty(name);
  const names=new Set<string>();for(const [name,value]of Object.entries(values)){if(!name.startsWith('--'))continue;element.style.setProperty(name,String(value));names.add(name);}applied.current.set(element,names);
 },[]);
 // Radix can mount Content without rerendering the hook owner. Apply on mount too.
 const syncForwarded=useCallback((element:T|null)=>{const ref=latest.current.forwarded,prior=attached.current;
  if(prior?.element===element&&prior.ref===ref)return;
  attached.current=null;
  if(prior){if(prior.cleanup)prior.cleanup();else if(typeof prior.ref==='function')prior.ref(null);else if(prior.ref)prior.ref.current=null;}
  if(element){const cleanup=typeof ref==='function'?ref(element):undefined;if(ref&&typeof ref!=='function')ref.current=element;attached.current={element,ref,...(typeof cleanup==='function'?{cleanup}:{})};}
 },[]);
 // Radix Presence may stabilize its DOM ref while the caller ref changes.
 // Reconcile caller ownership without forgetting variables owned on this node.
 const ref=useCallback((element:T|null)=>{node.current=element;if(element)apply(element);syncForwarded(element);},[apply,syncForwarded]);
 useLayoutEffect(()=>{if(node.current)apply(node.current);syncForwarded(node.current);});return ref;
}
