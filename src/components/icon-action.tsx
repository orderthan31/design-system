import React from "react";
import {Icon,type IconName} from "./icon";
import {IconButton} from "./icon-button";
import type {ButtonProps} from "./button";
export type IconActionProps = Omit<ButtonProps,'children'> & {name:IconName;label:string};
export function IconAction({name,label,...props}:IconActionProps){return <IconButton label={label} {...props}><Icon name={name}/></IconButton>;}
