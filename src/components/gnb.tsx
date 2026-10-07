import React, { useId, useState } from "react";
import { Button } from "./button";
import type { NavigationProps, NavigationGroup } from "./navigation-types";
export type { NavigationProps, NavigationItem, NavigationGroup } from "./navigation-types";
import "./gnb.css";
export function GNB({
  items,
  selectedId,
  onSelect,
  label = "전체 탐색",
}: NavigationProps) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <nav className="nr-gnb" aria-label={label} data-expanded={expanded}>
      <Button
        variant="secondary"
        className="nr-mobile-toggle"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded(!expanded)}
      >
        {label} {expanded ? "접기" : "펼치기"}
      </Button>
      <ul id={id}>
        {items.map((item) => (
          <li key={item.id}>
            <Button
              variant="ghost"
              disabled={item.disabled}
              aria-current={selectedId === item.id ? "page" : undefined}
              onClick={() => {
                onSelect(item.id);
                setExpanded(false);
              }}
            >
              {item.label}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
