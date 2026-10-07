import React from "react";
import {Icon} from "./icon";
import {IconAction} from "./icon-action";
import "./toast.css";
export function Toast({message,onDismiss}:{message:string;onDismiss:()=>void}){return <div role="status" className="ds-toast"><Icon name="check"/><span>{message}</span><IconAction name="close" label="알림 닫기" variant="ghost" onClick={onDismiss}/></div>;}
