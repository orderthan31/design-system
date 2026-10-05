import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, Menu, Tooltip } from "../src/components/navigation";
test("tabs follow arrow keys and associate panels", async () => {
  render(
    <Tabs
      items={[
        { label: "Preview", content: "Visual example" },
        { label: "Code", content: "Source example" },
      ]}
    />,
  );
  const first = screen.getByRole("tab", { name: "Preview" });
  first.focus();
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Code" })).toHaveFocus();
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Source example");
});
test("menu opens with keyboard, selects an item, and restores trigger focus", async () => {
  let selected = "";
  render(
    <Menu
      label="Options"
      items={["Duplicate", "Archive"]}
      onSelect={(v) => (selected = v)}
    />,
  );
  const trigger = screen.getByRole("button", { name: "Options" });
  trigger.focus();
  await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
  expect(selected).toBe("Archive");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
