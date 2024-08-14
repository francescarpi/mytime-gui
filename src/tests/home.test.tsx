import React from "react";
import { describe, it, afterEach, beforeAll, beforeEach, expect } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { mockIPC, clearMocks } from "@tauri-apps/api/mocks";

import App from "../App";
import { defaultSettings, defaultSummary } from "./constants";

describe("home page", () => {
  afterEach(cleanup);
  afterEach(clearMocks);

  beforeEach(() => {
    mockIPC((cmd: string): any => {
      switch (cmd) {
        case "group_tasks":
          return [];
        case "tasks":
          return [];
        case "settings":
          return defaultSettings;
        case "summary":
          return defaultSummary;
        default:
          return [];
      }
    });
  });

  it("is rendered properly", async () => {
    render(<App />);
    await waitFor(() => screen.getByText("MyTime"));
    await waitFor(() => screen.getByTestId("add-task-form"));
    await waitFor(() => screen.getByTestId("tasks-filter"));
    await waitFor(() => screen.getByTestId("tasks-table"));
  });
});
