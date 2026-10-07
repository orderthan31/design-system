import React from "react";
import "./action-group.css";
export function ActionGroup({
  children,
  label = "동작",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div role="group" aria-label={label} className="ds-actions">
      {children}
    </div>
  );
}
