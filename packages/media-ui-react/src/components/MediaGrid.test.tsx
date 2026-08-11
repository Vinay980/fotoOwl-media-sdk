import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { render, screen } from "@testing-library/react";

import type { MediaItem } from "@fotoowl/media-core";

import { MediaGrid } from "./MediaGrid.js";

const items: MediaItem[] = [
  {
    id: "1",
    type: "photo",
    width: 100,
    height: 100,
    url: "https://example.com/one.jpg",
  },
  {
    id: "2",
    type: "photo",
    width: 100,
    height: 100,
    url: "https://example.com/two.jpg",
  },
];

const observe = vi.fn();
const disconnect = vi.fn();

class IntersectionObserverMock {
  constructor(
    private callback: IntersectionObserverCallback,
  ) {
    observerInstance = this;
  }

  observe = observe;

  disconnect = disconnect;

  trigger(isIntersecting: boolean) {
    this.callback(
      [
        {
          isIntersecting,
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  }
}

let observerInstance:
  | IntersectionObserverMock
  | undefined;

beforeEach(() => {
  observerInstance = undefined;

  vi.stubGlobal(
    "IntersectionObserver",
    class extends IntersectionObserverMock {},
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("MediaGrid", () => {
  it("renders all media items", () => {
    render(
      <MediaGrid
        items={items}
      />,
    );

    expect(
      screen.getAllByRole("article"),
    ).toHaveLength(2);
  });

  it("loads more when the bottom sentinel becomes visible", () => {
    const onLoadMore = vi.fn();

    render(
      <MediaGrid
        items={items}
        hasNextPage
        onLoadMore={onLoadMore}
      />,
    );

    expect(observerInstance).toBeDefined();

    observerInstance?.trigger(true);

    expect(
      onLoadMore,
    ).toHaveBeenCalledTimes(1);
  });

  it("does not load more when there is no next page", () => {
    const onLoadMore = vi.fn();

    render(
      <MediaGrid
        items={items}
        hasNextPage={false}
        onLoadMore={onLoadMore}
      />,
    );

    expect(observerInstance).toBeUndefined();

    expect(
      onLoadMore,
    ).not.toHaveBeenCalled();
  });

  it("does not load more while already loading", () => {
    const onLoadMore = vi.fn();

    render(
      <MediaGrid
        items={items}
        hasNextPage
        loadingMore
        onLoadMore={onLoadMore}
      />,
    );

    expect(observerInstance).toBeUndefined();

    expect(
      onLoadMore,
    ).not.toHaveBeenCalled();
  });
});