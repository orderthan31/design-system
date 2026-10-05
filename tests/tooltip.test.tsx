import React from "react";
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent, createEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "../src/components/navigation";
test("tooltip consumes open Escape only, keeps focus, and never traps Tab", async () => {
  const bubbled = vi.fn();
  const submitted = vi.fn((e) => e.preventDefault());
  render(
    <form onSubmit={submitted}>
      <div onKeyDown={bubbled}>
        <Tooltip label="Help" text="Details" />
        <button type="button">Outside</button>
      </div>
    </form>,
  );
  const trigger = screen.getByRole("button", { name: "Help" });
  expect(trigger).toHaveAttribute("type", "button");
  await userEvent.click(trigger);
  const escape = createEvent.keyDown(trigger, {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  fireEvent(trigger, escape);
  expect(escape.defaultPrevented).toBe(true);
  expect(bubbled).not.toHaveBeenCalled();
  expect(trigger).toHaveFocus();
  expect(trigger).not.toHaveAttribute("aria-describedby");
  const second = createEvent.keyDown(trigger, {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  fireEvent(trigger, second);
  expect(second.defaultPrevented).toBe(false);
  expect(bubbled).toHaveBeenCalledTimes(1);
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  await userEvent.tab({ shift: true });
  expect(trigger).toHaveAccessibleDescription("Details");
  await userEvent.tab();
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  expect(submitted).not.toHaveBeenCalled();
});

test("tooltip still opens on hover and dismisses on mouse leave", async () => {
  render(<Tooltip label="Help" text="Details" />);
  const trigger = screen.getByRole("button", { name: "Help" });
  await userEvent.hover(trigger);
  expect(screen.getByRole("tooltip")).toHaveTextContent("Details");
  await userEvent.unhover(trigger);
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});

test("tooltip describes named trigger on focus and Escape dismisses it", async () => {
  render(<Tooltip label="Help" text="Extra information" />);
  const button = screen.getByRole("button", { name: "Help" });
  await userEvent.tab();
  expect(button).toHaveAccessibleDescription("Extra information");
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});
