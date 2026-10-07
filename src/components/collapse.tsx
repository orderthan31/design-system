import React,{useId,useState} from "react";
import {Button} from "./button";
import "./collapse.css";
export function Collapse({title,children}:{title:string;children:React.ReactNode}){const [open,setOpen]=useState(false);const id=useId();return <section className="ds-collapse"><Button variant="secondary" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}>{title}</Button><div id={id} hidden={!open}>{children}</div></section>;}
