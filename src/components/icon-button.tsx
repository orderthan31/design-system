import React from "react";
import {Button,type ButtonProps} from "./button";
export function IconButton({
  label,
  children,
  ...props
}: { label: string } & ButtonProps) {
  return (
    <Button
      {...props}
      variant={props.variant ?? "secondary"}
      data-slot="icon-button"
      aria-label={label}
    >
      {children}
    </Button>
  );
}
