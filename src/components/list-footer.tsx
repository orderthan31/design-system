import React from "react";
import { ActionGroup } from "./action-group";
import "./list-footer.css";
export type ListFooterProps = {
  children?: React.ReactNode;
  actions?: React.ReactNode;
};

export function ListFooter({ children, actions }: ListFooterProps) {
  return (
    <footer className="ds-list-footer">
      <div>{children}</div>
      {actions && <ActionGroup label="목록 바닥 동작">{actions}</ActionGroup>}
    </footer>
  );
}
