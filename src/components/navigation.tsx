import React, { useId, useRef, useState } from "react";
export function Tabs({
  items,
  label = "보기 전환",
}: {
  items: { label: string; content: React.ReactNode }[];
  label?: string;
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="tabs">
      <div role="tablist" aria-label={label}>
        {items.map((item, i) => (
          <button type="button"
            key={item.label}
            ref={(e) => {
              refs.current[i] = e;
            }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              const n =
                e.key === "ArrowRight"
                  ? (i + 1) % items.length
                  : e.key === "ArrowLeft"
                    ? (i + items.length - 1) % items.length
                    : e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? items.length - 1
                        : -1;
              if (n >= 0) {
                e.preventDefault();
                setActive(n);
                refs.current[n]?.focus();
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={active !== i}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
export function Menu({
  label = "작업 메뉴",
  items = ["복제", "보관"],
  onSelect,
}: {
  label?: string;
  items?: string[];
  onSelect?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  function focus(i: number) {
    root.current
      ?.querySelectorAll<HTMLButtonElement>("[role=menuitem]")
      [i]?.focus();
  }
  function show() {
    setOpen(true);
    setTimeout(() => focus(0), 0);
  }
  return (
    <div
      className="menu-wrap"
      ref={root}
      onKeyDown={(e) => {
        if (open && e.key === "Escape" && !e.defaultPrevented) {
          e.preventDefault();
          e.stopPropagation();
          close();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button type="button"
        className="button secondary"
        ref={trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            show();
          }
        }}
      >
        {label} <span aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div
          className="menu-popup"
          role="menu"
          id={id}
          aria-label={label}
          onKeyDown={(e) => {
            const list = Array.from(
              root.current!.querySelectorAll("[role=menuitem]"),
            );
            const i = list.indexOf(document.activeElement!);
            const n =
              e.key === "ArrowDown"
                ? (i + 1) % items.length
                : e.key === "ArrowUp"
                  ? (i + items.length - 1) % items.length
                  : e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? items.length - 1
                      : -1;
            if (n >= 0) {
              e.preventDefault();
              focus(n);
            }
          }}
        >
          {items.map((item) => (
            <button type="button"
              key={item}
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                onSelect?.(item);
                close();
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export function Tooltip({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span
      className="tooltip-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button type="button"
        className="button secondary"
        aria-describedby={open ? id : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (open && e.key === "Escape" && !e.defaultPrevented) {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
          }
        }}
      >
        {label}
      </button>
      {open && (
        <span id={id} role="tooltip" className="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}
