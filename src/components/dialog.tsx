import React, { useEffect, useLayoutEffect, useId, useRef } from "react";
import { IconButton } from "./icon-button";
import "./dialog.css";
export type DialogProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
};

const modalOwners: HTMLDialogElement[] = [];

let savedOverflow = "", savedPriority = "";

function focusFirst(dialog: HTMLDialogElement) {
  dialog.querySelector<HTMLElement>('button:not(:disabled),input:not(:disabled),a[href],[tabindex="0"]')?.focus();
}

function showAncestorsFirst(dialog: HTMLDialogElement) {
  const ancestors: HTMLDialogElement[] = [];
  let parent = dialog.parentElement?.closest<HTMLDialogElement>('dialog[data-modal-requested="true"]');
  while (parent) {ancestors.unshift(parent);parent = parent.parentElement?.closest<HTMLDialogElement>('dialog[data-modal-requested="true"]');}
  for (const current of [...ancestors, dialog]) if (!current.open) {
    if (typeof current.showModal === "function") current.showModal();else current.setAttribute("open", "");
  }
}

export function Dialog({
  open,
  title,
  children,
  onClose,
  footer,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useLayoutEffect(() => {
    const dialog = ref.current;if (!open || !dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!modalOwners.length) {savedOverflow = document.body.style.getPropertyValue("overflow");savedPriority = document.body.style.getPropertyPriority("overflow");document.body.style.setProperty("overflow", "hidden", "important");}
    const nested = modalOwners.findIndex(node => dialog.contains(node));
    modalOwners.splice(nested < 0 ? modalOwners.length : nested, 0, dialog);
    return () => {
      const wasTop = modalOwners.at(-1) === dialog;const index = modalOwners.indexOf(dialog);if(index>=0)modalOwners.splice(index,1);
      if (!modalOwners.length) {if(savedOverflow)document.body.style.setProperty("overflow",savedOverflow,savedPriority);else document.body.style.removeProperty("overflow");}
      if (dialog.open) {if(typeof dialog.close === "function")dialog.close();else dialog.removeAttribute("open");}
      if (wasTop) {const remaining = modalOwners.at(-1);if(opener?.isConnected && (!remaining || remaining.contains(opener)))opener.focus();else if(remaining)focusFirst(remaining);}
    };
  }, [open]);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      showAncestorsFirst(dialog);
      if (modalOwners.at(-1) === dialog) focusFirst(dialog);
    } else if (dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      aria-modal="true"
      data-modal-requested={open ? "true" : undefined}
      onKeyDown={(e) => {
        if (e.defaultPrevented || (e.target as Element).closest("dialog") !== e.currentTarget) return;
        if(e.key === "Escape" && modalOwners.at(-1) === e.currentTarget){e.preventDefault();e.stopPropagation();onClose();return;}
        if (e.key !== "Tab") return;
        const items = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])',
          ),
        ).filter((node) => node.getClientRects().length > 0);
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const b = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < b.left ||
            e.clientX > b.right ||
            e.clientY < b.top ||
            e.clientY > b.bottom
          )
            onClose();
        }
      }}
    >
      <div className="dialog-head">
        <h2 id={`${id}-title`}>{title}</h2>
        <IconButton label="대화상자 닫기" onClick={onClose}>
          ×
        </IconButton>
      </div>
      <div className="dialog-body">{children}</div>
      {footer && <div className="dialog-actions">{footer}</div>}
    </dialog>
  );
}
