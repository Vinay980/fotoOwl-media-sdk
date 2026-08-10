import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import type { MediaItem } from "@fotoowl/media-core";

import { MediaCard } from "./MediaCard.js";

const media: MediaItem = {
  id: "1",
  type: "photo",
  width: 1920,
  height: 1080,
  url: "https://example.com/photo.jpg",
  thumbnailUrl: "https://example.com/thumb.jpg",
  photographer: {
    id: "p1",
    name: "John Doe",
    url: "https://example.com/john",
  },
};

describe("MediaCard", () => {
  it("renders media information", () => {
    render(
      <MediaCard media={media} />,
    );

    expect(
      screen.getByAltText("Photo by John Doe"),
    ).toBeTruthy();

    expect(
      screen.getByText("John Doe"),
    ).toBeTruthy();
  });

  it("calls onSelect when clicked", () => {
    const onSelect = vi.fn();

    render(
      <MediaCard
        media={media}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(
      screen.getByRole("article"),
    );

    expect(onSelect).toHaveBeenCalledWith(
      media,
    );
  });
});