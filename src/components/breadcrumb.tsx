import React from "react";
import "./breadcrumb.css";
export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({
  items,
  label = "현재 위치",
}: {
  items: BreadcrumbItem[];
  label?: string;
}) {
  return (
    <nav className="nr-breadcrumb" aria-label={label}>
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
