import React from "react";
import "./badge.css";
export type Tone = "neutral" | "running" | "success" | "review" | "error";
export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
