import React,{useId,useState} from "react";
import {Button} from "./button";
import {Icon} from "./icon";
export interface AccordionItem {id:string;title:string;content:React.ReactNode;disabled?:boolean}
import "./accordion.css";
export function Accordion({items,multiple=false}:{items:readonly AccordionItem[];multiple?:boolean}){const [open,setOpen]=useState<string[]>([]);const id=useId();return <div className="ds-accordion">{items.map(item=><section key={item.id}><h3><Button variant="ghost" disabled={item.disabled} aria-expanded={open.includes(item.id)} aria-controls={`${id}-${item.id}`} onClick={()=>setOpen(current=>current.includes(item.id)?current.filter(value=>value!==item.id):multiple?[...current,item.id]:[item.id])}>{item.title}<Icon name={open.includes(item.id)?'chevron-up':'chevron-down'}/></Button></h3><div role="region" aria-label={item.title} id={`${id}-${item.id}`} hidden={!open.includes(item.id)}>{item.content}</div></section>)}</div>;}
