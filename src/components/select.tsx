import React from "react";
import "./input.css";
export function Select(props: React.ComponentPropsWithRef<"select">) {
  return <select data-slot="native-select" {...props} className={`control ${props.className ?? ""}`} />;
}
