import React, { useId } from "react";
import { Input } from "./atoms";
import { Stack } from "./layout";
import "./layout.css";
import { ActionGroup } from "./action-group";
export { ActionGroup } from "./action-group";
export { SearchField } from "./search-field";
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
