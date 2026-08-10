import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";

import { useMediaClient } from "./MediaProvider.js";

describe("useMediaClient", () => {
  it("throws when used outside MediaProvider", () => {
    expect(() => {
      renderHook(() => useMediaClient());
    }).toThrow(
      "useMediaClient must be used inside MediaProvider.",
    );
  });
});