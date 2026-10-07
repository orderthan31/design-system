import React from "react";
import {Icon,iconNames} from "./icon";
export {Icon,iconNames,type IconName,type IconProps} from "./icon";
export {IconAction,type IconActionProps} from "./icon-action";
export function IconGallery(){return <section aria-label="아이콘"><h2>아이콘</h2><div className="ds-icon-grid">{iconNames.map(name=><div key={name}><Icon name={name}/><code>{name}</code></div>)}</div></section>;}
