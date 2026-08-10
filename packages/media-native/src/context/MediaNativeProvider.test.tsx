import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";

import { useMediaClient } from "./MediaNativeProvider.js";

describe("useMediaClient", () => {
  it("throws when used outside MediaNativeProvider", () => {
    expect(() => {
      renderHook(() => useMediaClient());
    }).toThrow(
      "useMediaClient must be used inside MediaNativeProvider.",
    );
  });
});