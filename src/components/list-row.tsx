import React from "react";
import { Button } from "./atoms";
import { Checkbox } from "./primitives";
import { ActionGroup } from "./composition";
import "./list-row.css";

export type ListRowProps = {
  title: string;
  description?: React.ReactNode;
  leading?: React.ReactNode;
  content?: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  action?: { label: string; onClick: () => void };
};

export function ListRow({
  title,
  description,
  leading,
  content,
  trailing,
  disabled = false,
  selected = false,
  onSelectionChange,
  action,
}: ListRowProps) {
  return (
    <li className="ds-list-row" data-selected={selected || undefined}>
      {onSelectionChange && (
        <Checkbox
          label={`${title} 선택`}
          checked={selected}
          disabled={disabled}
          onChange={(event) => {
            if (!disabled) onSelectionChange(event.target.checked);
          }}
        />
      )}
      {leading != null && (
        <div data-slot="leading" className="ds-list-row-leading">
          {leading}
        </div>
      )}
      <div data-slot="content" className="ds-list-row-content">
        <strong>{title}</strong>
        {description != null && (
          <div className="ds-list-row-description">{description}</div>
        )}
        {content}
      </div>
      {(trailing != null || action) && (
        <div data-slot="trailing" className="ds-list-row-trailing">
          {trailing}
          {action && (
            <Button
              variant="secondary"
              size="small"
              disabled={disabled}
              onClick={() => {
                if (!disabled) action.onClick();
              }}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </li>
  );
}

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
