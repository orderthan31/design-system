import React from "react";
import { test, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  createEvent,
  waitFor,
} from "@testing-library/react";
import { Dialog } from "../src/components/organisms";
import { Menu, Tooltip } from "../src/components/navigation";

test("Menu inside Dialog consumes the first Escape and leaves parent ownership intact", async () => {
  const close = vi.fn();
  function Example() {
    const [open, setOpen] = React.useState(true);
    return (
      <Dialog
        open={open}
        title="Menu parent"
        onClose={() => {
          close();
          setOpen(false);
        }}
      >
        <Menu label="Child menu" items={["First action"]} />
      </Dialog>
    );
  }
  render(<Example />);
  const dialog = screen.getByRole("dialog", { name: "Menu parent" });
  const trigger = screen.getByRole("button", { name: "Child menu" });
  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  const item = screen.getByRole("menuitem", { name: "First action" });
  await waitFor(() => expect(item).toHaveFocus());
  const escape = createEvent.keyDown(item, {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  fireEvent(item, escape);
  expect(close).not.toHaveBeenCalled();
  expect(escape.defaultPrevented).toBe(true);
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(dialog).toHaveAttribute("open");
  expect(document.body.style.overflow).toBe("hidden");
  expect(trigger).toHaveFocus();
  const secondEscape = createEvent.keyDown(trigger, {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  fireEvent(trigger, secondEscape);
  expect(secondEscape.defaultPrevented).toBe(true);
  expect(close).toHaveBeenCalledTimes(1);
  expect(dialog).not.toHaveAttribute("open");
  expect(document.body.style.overflow).not.toBe("hidden");
});

test("Tooltip inside Dialog consumes only its open-layer Escape", () => {
  const close = vi.fn();
  function Example() {
    const [open, setOpen] = React.useState(true);
    return (
      <Dialog
        open={open}
        title="Tooltip parent"
        onClose={() => {
          close();
          setOpen(false);
        }}
      >
        <Tooltip label="Child help" text="Details" />
      </Dialog>
    );
  }
  render(<Example />);
  const dialog = screen.getByRole("dialog", { name: "Tooltip parent" });
  const trigger = screen.getByRole("button", { name: "Child help" });
  fireEvent.focus(trigger);
  trigger.focus();
  expect(screen.getByRole("tooltip")).toBeInTheDocument();
  const escape = createEvent.keyDown(trigger, {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  fireEvent(trigger, escape);
  expect(close).not.toHaveBeenCalled();
  expect(escape.defaultPrevented).toBe(true);
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  expect(dialog).toHaveAttribute("open");
  expect(document.body.style.overflow).toBe("hidden");
  expect(trigger).toHaveFocus();
  const secondEscape = createEvent.keyDown(trigger, {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  fireEvent(trigger, secondEscape);
  expect(secondEscape.defaultPrevented).toBe(true);
  expect(close).toHaveBeenCalledTimes(1);
  expect(dialog).not.toHaveAttribute("open");
  expect(document.body.style.overflow).not.toBe("hidden");
});

test("Dialog respects a descendant-prevented Escape without closing", () => {
  const close = vi.fn();
  render(
    <Dialog open title="Prevented parent" onClose={close}>
      <button
        onKeyDown={(e) => {
          if (e.key === "Escape") e.preventDefault();
        }}
      >
        Consumer
      </button>
    </Dialog>,
  );
  const button = screen.getByRole("button", { name: "Consumer" });
  button.focus();
  fireEvent.keyDown(button, { key: "Escape" });
  expect(close).not.toHaveBeenCalled();
  expect(screen.getByRole("dialog")).toHaveAttribute("open");
  expect(document.body.style.overflow).toBe("hidden");
  expect(button).toHaveFocus();
});

test("plain Dialog and nested Dialog share reference-counted scroll ownership", () => {
  document.body.style.setProperty("overflow", "auto", "important");
  const close = vi.fn();
  const { rerender, unmount } = render(
    <Dialog open title="바깥" onClose={close}>
      <Dialog open title="안쪽" onClose={close}>
        내용
      </Dialog>
    </Dialog>,
  );
  expect(document.body.style.overflow).toBe("hidden");
  fireEvent.keyDown(screen.getByRole("dialog", { name: "안쪽" }), {
    key: "Escape",
  });
  expect(close).toHaveBeenCalledTimes(1);
  rerender(
    <Dialog open title="바깥" onClose={close}>
      내용
    </Dialog>,
  );
  expect(document.body.style.overflow).toBe("hidden");
  unmount();
  expect(document.body.style.overflow).toBe("auto");
  expect(document.body.style.getPropertyPriority("overflow")).toBe("important");
  document.body.style.removeProperty("overflow");
});
