import React, { useEffect, useId, useRef } from "react";
import { Button } from "./atoms";
import { IconButton } from "./primitives";
export type DialogProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
};
export function Dialog({
  open,
  title,
  children,
  onClose,
  footer,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      if (typeof dialog.showModal === "function" && !dialog.open)
        dialog.showModal();
      else dialog.setAttribute("open", "");
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
      onKeyDown={(e) => {
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
export function Confirm({
  onConfirm,
  loading = false,
  ...props
}: Omit<DialogProps, "footer"> & { onConfirm: () => void; loading?: boolean }) {
  return (
    <Dialog
      {...props}
      footer={
        <>
          <Button variant="secondary" onClick={props.onClose}>
            취소
          </Button>
          <Button loading={loading} onClick={onConfirm}>
            확인
          </Button>
        </>
      }
    />
  );
}
