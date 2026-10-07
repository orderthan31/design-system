import React from "react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import "./list-item.css";
export type ListItemProps = {
  title: string;
  description?: React.ReactNode;
  thumbnail?: React.ReactNode;
  selected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  action?: { label: string; onClick: () => void };
};

export function ListItem({
  title,
  description,
  thumbnail,
  selected = false,
  onSelectionChange,
  action,
}: ListItemProps) {
  return (
    <li className="ds-list-item" data-selected={selected || undefined}>
      {onSelectionChange && (
        <Checkbox
          label={`${title} 선택`}
          checked={selected}
          onChange={(event) => onSelectionChange(event.target.checked)}
        />
      )}
      {thumbnail && <div className="ds-list-thumbnail">{thumbnail}</div>}
      <div className="ds-list-content">
        <strong>{title}</strong>
        {description && <p>{description}</p>}
      </div>
      {action && (
        <Button variant="secondary" size="small" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </li>
  );
}
