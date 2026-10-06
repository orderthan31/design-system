// Adapted from shadcn-ui/ui InputGroup (MIT); source and license: docs/vendor/shadcn-input-group.md.
import React from 'react';
import { Input, type InputProps } from './atoms';
import './input-group.css';
export function InputGroup({className='',...props}:React.ComponentProps<'div'>){return <div data-slot="input-group" role="group" className={`ds-input-group ${className}`} {...props}/>;}
export function InputGroupAddon({className='',...props}:React.ComponentProps<'div'>){return <div data-slot="input-group-addon" data-align="inline-end" className={`ds-input-group-addon ${className}`} {...props}/>;}
export function InputGroupInput(props:InputProps){return <Input data-slot="input-group-control" {...props}/>;}
