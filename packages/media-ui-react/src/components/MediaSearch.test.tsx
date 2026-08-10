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

import { MediaSearch } from "./MediaSearch.js";

describe("MediaSearch", () => {
  it("submits a trimmed query", () => {
    const onSearch = vi.fn();

    render(
      <MediaSearch
        onSearch={onSearch}
      />,
    );

    const input =
      screen.getByLabelText("Search media");

    fireEvent.change(input, {
      target: {
        value: "  football  ",
      },
    });

    fireEvent.submit(
      screen.getByRole("button", {
        name: "Search",
      }),
    );

    expect(onSearch).toHaveBeenCalledWith(
      "football",
    );
  });

  it("does not submit an empty query", () => {
    const onSearch = vi.fn();

    render(
      <MediaSearch
        onSearch={onSearch}
      />,
    );

    const button =
      screen.getByRole("button", {
        name: "Search",
      });

    expect(
      (button as HTMLButtonElement).disabled,
    ).toBe(true);

    expect(onSearch).not.toHaveBeenCalled();
  });
});