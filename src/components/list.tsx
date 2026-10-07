import React from "react";
import "./list.css";
export type ListProps = React.HTMLAttributes<HTMLUListElement> & {
  label: string;
};

export function List({ label, className = "", ...props }: ListProps) {
  return (
    <ul {...props} aria-label={label} className={`ds-list ${className}`} />
  );
}
