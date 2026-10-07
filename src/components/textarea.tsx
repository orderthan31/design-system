import React from "react";
import "./textarea.css";
export function Textarea(
  props: React.ComponentPropsWithRef<"textarea">,
) {
  return (
    <textarea data-slot="textarea-root"
      {...props}
      className={`control textarea ${props.className ?? ""}`}
    />
  );
}
