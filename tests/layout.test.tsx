import React from "react";
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import { Container, Stack, Grid, Shell } from "../src/components/layout";
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
