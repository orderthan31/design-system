import React, { useEffect, useId, useRef, useState } from "react";
import "./button.css";
import "./popover.css";
export type PopoverProps = {
  label: string;
  title: string;
  children: React.ReactNode;
};

export function Popover({ label, title, children }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        close();
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        close();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div
      className="nr-popover"
      ref={root}
      onKeyDown={(event) => {
        if (open && event.key === "Escape" && !event.defaultPrevented) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }}
    >
      <button
        type="button"
        className="button secondary"
        ref={trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {label}
      </button>
      {open && (
        <div
          className="nr-popover-panel"
          id={id}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${id}-title`}
        >
          <h3 id={`${id}-title`}>{title}</h3>
          {children}
        </div>
      )}
    </div>
  );
}
