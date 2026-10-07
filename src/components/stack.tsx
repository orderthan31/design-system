import React from "react";
import "./stack.css";
type Props = React.ComponentPropsWithRef<"div">;
export function Stack({ children, className = "", ...props }: Props) {
  return (
    <div {...props} className={`ds-stack ${className}`} data-layout="stack">
      {children}
    </div>
  );
}
