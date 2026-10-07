import React from "react";
import {Badge,type Tone} from "./badge";
import "./alert.css";
export function Alert({
  title,
  children,
  tone = "running",
}: {
  title: string;
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <div
      className={`alert ${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <Badge tone={tone}>{title}</Badge>
      <div>{children}</div>
    </div>
  );
}
