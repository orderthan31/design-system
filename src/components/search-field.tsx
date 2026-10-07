import React from "react";
import { Input } from "./input";
export function SearchField(
  props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
) {
  return <Input {...props} type="search" />;
}
