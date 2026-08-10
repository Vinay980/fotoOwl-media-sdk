import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

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

describe("MediaGrid", () => {
  it("renders all media items", () => {
    render(
      <MediaGrid items={items} />,
    );

    expect(
      screen.getAllByRole("article"),
    ).toHaveLength(2);
  });
});