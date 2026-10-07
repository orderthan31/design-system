import React from "react";
import { Dialog, type DialogProps } from "./dialog";
import "./modal-region.css";
export type ModalRegionProps = DialogProps;

export function ModalRegion({kind,...props}: ModalRegionProps & {kind:"drawer"|"sheet"}) {
  return props.open ? <div className={`nr-modal nr-${kind}`}><Dialog {...props}/></div> : null;
}
