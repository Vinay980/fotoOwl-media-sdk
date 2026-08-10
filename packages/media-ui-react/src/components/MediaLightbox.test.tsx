import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import type { MediaItem } from "../types/media.js";
import { MediaLightbox } from "./MediaLightbox.js";

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
  },
};

describe("MediaLightbox", () => {
  it("renders the selected media", () => {
    render(
      <MediaLightbox
        media={media}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("dialog"),
    ).toBeTruthy();

    expect(
      screen.getByAltText("Photo by John Doe"),
    ).toBeTruthy();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();

    render(
      <MediaLightbox
        media={media}
        onClose={onClose}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when no media is selected", () => {
    const { container } = render(
      <MediaLightbox
        media={null}
        onClose={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});