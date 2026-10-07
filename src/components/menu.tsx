import React,{useId,useRef,useState} from "react";
import "./menu.css";
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
