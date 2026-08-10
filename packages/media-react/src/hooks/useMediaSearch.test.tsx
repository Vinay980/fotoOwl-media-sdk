import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import type {
  MediaClient,
  MediaPage,
} from "@fotoowl/media-core";

import { MediaProvider } from "../context/MediaProvider.js";
import { useMediaSearch } from "./useMediaSearch.js";

const mockPage: MediaPage = {
  items: [
    {
      id: "1",
      type: "photo",
      width: 1920,
      height: 1080,
      url: "https://example.com/photo.jpg",
    },
  ],
  page: 1,
  perPage: 20,
  totalResults: 1,
  hasNextPage: false,
};

describe("useMediaSearch", () => {
  it("loads search results", async () => {
    const search = vi.fn().mockResolvedValue(mockPage);

    const client = {
      search,
    } as unknown as MediaClient;

    const wrapper = ({
      children,
    }: {
      children: ReactNode;
    }) => (
      <MediaProvider
        apiKey="test-key"
        client={client}
      >
        {children}
      </MediaProvider>
    );

    const { result } = renderHook(
      () =>
        useMediaSearch({
          query: "football",
        }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPage);
    });

    expect(search).toHaveBeenCalledWith({
      query: "football",
      page: 1,
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasNextPage).toBe(false);
  });

  it("loads the next page and appends results", async () => {
    const firstPage: MediaPage = {
      items: [
        {
          id: "1",
          type: "photo",
          width: 1920,
          height: 1080,
          url: "https://example.com/one.jpg",
        },
      ],
      page: 1,
      perPage: 20,
      totalResults: 2,
      hasNextPage: true,
    };

    const secondPage: MediaPage = {
      items: [
        {
          id: "2",
          type: "photo",
          width: 1920,
          height: 1080,
          url: "https://example.com/two.jpg",
        },
      ],
      page: 2,
      perPage: 20,
      totalResults: 2,
      hasNextPage: false,
    };

    const search = vi
      .fn()
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage);

    const client = {
      search,
    } as unknown as MediaClient;

    const wrapper = ({
      children,
    }: {
      children: ReactNode;
    }) => (
      <MediaProvider
        apiKey="test-key"
        client={client}
      >
        {children}
      </MediaProvider>
    );

    const { result } = renderHook(
      () =>
        useMediaSearch({
          query: "football",
        }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(firstPage);
    });

    await result.current.loadMore();

    await waitFor(() => {
      expect(result.current.data?.items).toHaveLength(2);
    });

    expect(
      result.current.data?.items.map((item) => item.id),
    ).toEqual(["1", "2"]);

    expect(result.current.hasNextPage).toBe(false);

    expect(search).toHaveBeenNthCalledWith(1, {
      query: "football",
      page: 1,
    });

    expect(search).toHaveBeenNthCalledWith(2, {
      query: "football",
      page: 2,
    });
  });
});