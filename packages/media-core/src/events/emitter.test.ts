import { describe, expect, it, vi } from "vitest";

import { EventEmitter } from "./emitter.js";

describe("EventEmitter", () => {
  it("emits events to subscribed listeners", () => {
    const emitter = new EventEmitter();

    const listener = vi.fn();

    const media = {
      id: "1",
      type: "photo" as const,
      width: 100,
      height: 100,
      url: "https://example.com/photo.jpg",
    };

    emitter.on("view", listener);

    emitter.emit("view", {
      media,
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      media,
    });
  });

  it("supports unsubscribe", () => {
    const emitter = new EventEmitter();

    const listener = vi.fn();

    const unsubscribe = emitter.on("view", listener);

    unsubscribe();

    emitter.emit("view", {
      media: {
        id: "1",
        type: "photo",
        width: 100,
        height: 100,
        url: "https://example.com/photo.jpg",
      },
    });

    expect(listener).not.toHaveBeenCalled();
  });
});