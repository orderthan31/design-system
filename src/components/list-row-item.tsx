import React from "react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import "./list-row-item.css";
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
