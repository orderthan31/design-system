import React, { useId } from "react";
import { Input } from "./atoms";
import { Stack } from "./layout";
import "./layout.css";
export function ActionGroup({
  children,
  label = "동작",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div role="group" aria-label={label} className="ds-actions">
      {children}
    </div>
  );
}
export function SearchField(
  props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
) {
  return <Input {...props} type="search" />;
}
export function FormSection({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="ds-section">
      <h3 id={id}>{title}</h3>
      <Stack>{children}</Stack>
      {actions && <ActionGroup>{actions}</ActionGroup>}
    </section>
  );
}
export function ListPanel({
  title,
  toolbar,
  children,
}: {
  title: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="ds-section">
      <h3 id={id}>{title}</h3>
      {toolbar}
      <Stack>{children}</Stack>
    </section>
  );
}
