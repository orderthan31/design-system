import React from "react";
type Props = React.HTMLAttributes<HTMLDivElement>;
export function Container({ children, className = "", ...props }: Props) {
  return (
    <div
      {...props}
      className={`ds-container ${className}`}
      data-layout="container"
    >
      {children}
    </div>
  );
}
export function Stack({ children, className = "", ...props }: Props) {
  return (
    <div {...props} className={`ds-stack ${className}`} data-layout="stack">
      {children}
    </div>
  );
}
export function Grid({ children, className = "", ...props }: Props) {
  return (
    <div {...props} className={`ds-grid ${className}`} data-layout="grid">
      {children}
    </div>
  );
}
export function Shell({
  children,
  navigation,
  header,
}: {
  children: React.ReactNode;
  navigation: React.ReactNode;
  header: React.ReactNode;
}) {
  return (
    <div className="ds-shell" data-layout="shell">
      <aside>{navigation}</aside>
      <div>
        <header>{header}</header>
        <main>{children}</main>
      </div>
    </div>
  );
}
