import { describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
} from "@testing-library/react";

import type { MediaItem } from "../types/media.js";
import { MediaReel } from "./MediaReel.js";

const observe = vi.fn();
const disconnect = vi.fn();

class MockIntersectionObserver {
  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {}

  observe = observe;
  disconnect = disconnect;
  unobserve = vi.fn();
}

vi.stubGlobal(
  "IntersectionObserver",
  MockIntersectionObserver,
);

const items: MediaItem[] = [
  {
    id: "1",
    type: "photo",
    width: 1920,
    height: 1080,
    url: "https://example.com/photo.jpg",
    photographer: {
      name: "John Doe",
    },
  },
  {
    id: "2",
    type: "photo",
    width: 1920,
    height: 1080,
    url: "https://example.com/photo-2.jpg",
    photographer: {
      name: "Jane Doe",
    },
  },
];

describe("MediaReel", () => {
  it("renders all media items", () => {
    render(
      <MediaReel items={items} />,
    );

    expect(
      screen.getByAltText("Photo by John Doe"),
    ).toBeTruthy();

    expect(
      screen.getByAltText("Photo by Jane Doe"),
    ).toBeTruthy();
  });

  it("registers visibility observers", () => {
    observe.mockClear();

    render(
      <MediaReel
        items={items}
        onActiveChange={vi.fn()}
      />,
    );

    expect(observe).toHaveBeenCalledTimes(2);
  });

  it("renders nothing when there are no items", () => {
    const { container } = render(
      <MediaReel items={[]} />,
    );

    expect(container.firstChild).toBeNull();
  });
});