import React from "react";
import {MultiSelect,type MultiSelectProps} from "./multi-select";
export type CheckboxGroupProps = Omit<MultiSelectProps, "showTags">;
export function CheckboxGroup(props: CheckboxGroupProps) {
  return <MultiSelect {...props} showTags={false} />;
}
