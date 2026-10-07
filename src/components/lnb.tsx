import React, { useId, useState } from "react";
import { Button } from "./button";
import type { NavigationProps, NavigationGroup } from "./navigation-types";
export type { NavigationProps, NavigationItem, NavigationGroup } from "./navigation-types";
import "./lnb.css";
export function LNB({
  groups,
  selectedId,
  onSelect,
  label = "영역 탐색",
}: Omit<NavigationProps, "items"> & { groups: NavigationGroup[] }) {
  const [expanded, setExpanded] = useState(true);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const id = useId();
  return (
    <nav className="nr-lnb" aria-label={label}>
      <Button
        variant="secondary"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded(!expanded)}
      >
        {label} {expanded ? "접기" : "펼치기"}
      </Button>
      <div id={id} hidden={!expanded}>
        {groups.map((group) => (
          <section key={group.id}>
            <Button
              variant="quiet"
              aria-expanded={!collapsed.includes(group.id)}
              aria-controls={`${id}-${group.id}`}
              onClick={() =>
                setCollapsed((current) =>
                  current.includes(group.id)
                    ? current.filter((value) => value !== group.id)
                    : [...current, group.id],
                )
              }
            >
              {group.label}
            </Button>
            <ul id={`${id}-${group.id}`} hidden={collapsed.includes(group.id)}>
              {group.items.map((item) => (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    disabled={item.disabled}
                    aria-current={selectedId === item.id ? "page" : undefined}
                    onClick={() => onSelect(item.id)}
                  >
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
}
