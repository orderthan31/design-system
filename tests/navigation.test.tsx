import React from "react";
import { test, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  createEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, Menu, Tooltip } from "../src/components/navigation";
test("menu consumes Escape only while open and restores focus without submitting", async () => {
  const bubbled = vi.fn();
  const submitted = vi.fn((e) => e.preventDefault());
  render(
    <form onSubmit={submitted}>
      <div onKeyDown={bubbled}>
        <Menu label="Options" items={["Duplicate"]} />
      </div>
    </form>,
  );
  const trigger = screen.getByRole("button", { name: "Options" });
  expect(trigger).toHaveAttribute("type", "button");
  await userEvent.click(trigger);
  const item = screen.getByRole("menuitem");
  await waitFor(() => expect(item).toHaveFocus());
  expect(item).toHaveAttribute("type", "button");
  const escape = createEvent.keyDown(item, {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  fireEvent(item, escape);
  expect(escape.defaultPrevented).toBe(true);
  expect(bubbled).not.toHaveBeenCalled();
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  const second = createEvent.keyDown(trigger, {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  fireEvent(trigger, second);
  expect(second.defaultPrevented).toBe(false);
  expect(bubbled).toHaveBeenCalledTimes(1);
  expect(submitted).not.toHaveBeenCalled();
});

test("open menu trigger also consumes Escape; tabbing outside still dismisses", async () => {
  render(
    <>
      <Menu label="Options" items={["Duplicate"]} />
      <button>Outside</button>
    </>,
  );
  const trigger = screen.getByRole("button", { name: "Options" });
  await userEvent.click(trigger);
  await waitFor(() => expect(screen.getByRole("menuitem")).toHaveFocus());
  trigger.focus();
  const escape = createEvent.keyDown(trigger, {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  fireEvent(trigger, escape);
  expect(escape.defaultPrevented).toBe(true);
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  await userEvent.click(trigger);
  await waitFor(() => expect(screen.getByRole("menuitem")).toHaveFocus());
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});

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
