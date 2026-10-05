import React from 'react';
import {Menu,ChevronDown,ChevronLeft,ChevronRight,ChevronUp,X,Search,Plus,Minus,Trash2,Pencil,Save,Upload,Download,Copy,Filter,ArrowUpDown,Calendar,Clock,File,Folder,Settings,User,Check,TriangleAlert,Info,LoaderCircle,RotateCw,Eye,EyeOff,Link,Play,Pause,Volume2,Image as ImageIcon,Video, type LucideProps} from 'lucide-react';
import {IconButton} from './primitives';
import type {ButtonProps} from './atoms';

// Explicit static subset: no wildcard registry or runtime import of the icon pack.
const icons = {menu:Menu,'chevron-down':ChevronDown,'chevron-left':ChevronLeft,'chevron-right':ChevronRight,'chevron-up':ChevronUp,close:X,search:Search,plus:Plus,minus:Minus,delete:Trash2,edit:Pencil,save:Save,upload:Upload,download:Download,copy:Copy,filter:Filter,sort:ArrowUpDown,calendar:Calendar,clock:Clock,file:File,folder:Folder,settings:Settings,user:User,check:Check,warning:TriangleAlert,info:Info,loading:LoaderCircle,retry:RotateCw,eye:Eye,'eye-off':EyeOff,link:Link,play:Play,pause:Pause,volume:Volume2,image:ImageIcon,video:Video} as const;
export type IconName = keyof typeof icons;
export const iconNames = Object.keys(icons) as IconName[];
export type IconProps = Omit<LucideProps,'ref'> & {name:IconName};
export function Icon({name,size=20,strokeWidth=1.75,...props}:IconProps){const Component=icons[name];return <Component size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...props}/>;}
export type IconActionProps = Omit<ButtonProps,'children'> & {name:IconName;label:string};
export function IconAction({name,label,...props}:IconActionProps){return <IconButton label={label} {...props}><Icon name={name}/></IconButton>;}
export function IconGallery(){return <section aria-label="아이콘"><h2>아이콘</h2><div className="ds-icon-grid">{iconNames.map(name=><div key={name}><Icon name={name}/><code>{name}</code></div>)}</div></section>;}
