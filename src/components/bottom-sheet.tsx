import React from "react";
import { ModalRegion, type ModalRegionProps } from "./modal-region";
export type { ModalRegionProps } from "./modal-region";
import "./bottom-sheet.css";
export function BottomSheet(props: ModalRegionProps) {
  return <ModalRegion {...props} kind="sheet" />;
}
