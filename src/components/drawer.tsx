import React from "react";
import { ModalRegion, type ModalRegionProps } from "./modal-region";
export type { ModalRegionProps } from "./modal-region";
import "./drawer.css";
export function Drawer(props: ModalRegionProps) {
  return <ModalRegion {...props} kind="drawer" />;
}
