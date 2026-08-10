import { describe, expect, it, vi } from "vitest";

import { RequestDeduplicator } from "./request-deduplicator.js";

describe("RequestDeduplicator", () => {
  it("reuses an in-flight request", async () => {
    const deduplicator = new RequestDeduplicator();

    const request = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve("result"), 10);
        }),
    );

    const [first, second] = await Promise.all([
      deduplicator.execute("same-key", request),
      deduplicator.execute("same-key", request),
    ]);

    expect(first).toBe("result");
    expect(second).toBe("result");
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("allows a new request after completion", async () => {
    const deduplicator = new RequestDeduplicator();

    const request = vi.fn(async () => "result");

    await deduplicator.execute("same-key", request);
    await deduplicator.execute("same-key", request);

    expect(request).toHaveBeenCalledTimes(2);
  });
});