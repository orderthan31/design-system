import React from "react";
import { ActionGroup } from "./action-group";
import "./list-header.css";
export type ListHeaderProps = {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
};

export function ListHeader({
  title,
  description,
  children,
  actions,
}: ListHeaderProps) {
  return (
    <header className="ds-list-header">
      <div className="ds-list-header-top">
        <div>
          <h3>{title}</h3>
          {description != null && (
            <div className="ds-list-row-description">{description}</div>
          )}
        </div>
        {actions && <ActionGroup label="목록 머리 동작">{actions}</ActionGroup>}
      </div>
      {children}
    </header>
  );
}
