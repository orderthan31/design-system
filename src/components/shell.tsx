import React from "react";
import "./shell.css";
export function Shell({
  children,
  navigation,
  header,
  mainAs: Main = "main",
}: {
  children: React.ReactNode;
  navigation: React.ReactNode;
  header: React.ReactNode;
  mainAs?: "main" | "div";
}) {
  return (
    <div className="ds-shell" data-layout="shell">
      <aside>{navigation}</aside>
      <div>
        <header>{header}</header>
        <Main className="ds-shell-content">{children}</Main>
      </div>
    </div>
  );
}
