import React from "react";
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import { Container, Stack, Grid, Shell } from "../src/components/layout";
test("Shell can embed content without adding a second document main landmark", () => {
  render(
    <main>
      <Shell mainAs="div" navigation={<nav>탐색</nav>} header={<h2>영역</h2>}>
        내용
      </Shell>
    </main>,
  );
  expect(screen.getAllByRole("main")).toHaveLength(1);
});

test("Shell composes named navigation, header and main slots using reusable layouts", () => {
  render(
    <Shell
      navigation={<nav aria-label="Example navigation">Links</nav>}
      header={<h1>Neutral layout</h1>}
    >
      <Container>
        <Stack>
          <Grid>
            <p>Editable content</p>
          </Grid>
        </Stack>
      </Container>
    </Shell>,
  );
  expect(screen.getByRole("main")).toHaveTextContent("Editable content");
  expect(
    screen.getByRole("navigation", { name: "Example navigation" }),
  ).toBeVisible();
  expect(
    screen.getByText("Editable content").closest('[data-layout="grid"]'),
  ).not.toBeNull();
});
