import React from "react";
import {Button} from "./button";
import {Alert} from "./alert";
import {Icon} from "./icon";
import "./error-state.css";
export function ErrorState({message='불러오지 못했습니다',onRetry}:{message?:string;onRetry:()=>void}){return <Alert tone="error" title={message}><Button variant="secondary" onClick={onRetry}><Icon name="retry"/>다시 시도</Button></Alert>;}
