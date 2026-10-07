import React from "react";
import { Dialog, type DialogProps } from "./dialog";
import { Button } from "./button";
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
