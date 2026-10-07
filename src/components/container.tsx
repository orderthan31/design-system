import React from "react";
import "./container.css";
type Props = React.ComponentPropsWithRef<"div">;
export function Container({ children, className = "", ...props }: Props) {
  return (
    <div
      {...props}
      className={`ds-container ${className}`}
      data-layout="container"
    >
      {children}
    </div>
  );
}
