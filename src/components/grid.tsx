import React from "react";
import "./grid.css";
type Props = React.ComponentPropsWithRef<"div">;
export function Grid({ children, className = "", ...props }: Props) {
  return (
    <div {...props} className={`ds-grid ${className}`} data-layout="grid">
      {children}
    </div>
  );
}
