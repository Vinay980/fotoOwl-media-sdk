import { describe, expect, it, vi } from "vitest";

import { MemoryCache } from "./memory-cache.js";

describe("MemoryCache", () => {
  it("stores and retrieves values", () => {
    const cache = new MemoryCache();

    cache.set("test", {
      value: "hello",
    });

    expect(cache.get("test")).toEqual({
      value: "hello",
    });
  });

  it("returns undefined for expired entries", () => {
    vi.useFakeTimers();

    const cache = new MemoryCache({
      ttlMs: 1000,
    });

    cache.set("test", "hello");

    vi.advanceTimersByTime(1001);

    expect(cache.get("test")).toBeUndefined();

    vi.useRealTimers();
  });

  it("can clear all entries", () => {
    const cache = new MemoryCache();

    cache.set("one", 1);
    cache.set("two", 2);

    cache.clear();

    expect(cache.get("one")).toBeUndefined();
    expect(cache.get("two")).toBeUndefined();
  });
});