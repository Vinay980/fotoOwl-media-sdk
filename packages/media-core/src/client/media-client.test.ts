import { describe, expect, it, vi } from "vitest";

import { MediaError } from "../errors/media-error.js";
import { MediaClient } from "./media-client.js";

describe("MediaClient", () => {
  it("rejects an empty search query", async () => {
    const client = new MediaClient({
      apiKey: "test-key",
    });

    await expect(
      client.search({
        query: "   ",
      }),
    ).rejects.toMatchObject({
      code: "INVALID_REQUEST",
    });
  });

  it("rejects invalid page values", async () => {
    const client = new MediaClient({
      apiKey: "test-key",
    });

    await expect(
      client.search({
        query: "football",
        page: 0,
      }),
    ).rejects.toMatchObject({
      code: "INVALID_REQUEST",
    });
  });

  it("rejects perPage values above the API limit", async () => {
    const client = new MediaClient({
      apiKey: "test-key",
    });

    await expect(
      client.search({
        query: "football",
        perPage: 81,
      }),
    ).rejects.toMatchObject({
      code: "INVALID_REQUEST",
    });
  });

  it("emits view events and supports unsubscribe", () => {
    const client = new MediaClient({
      apiKey: "test-key",
    });

    const listener = vi.fn();

    const unsubscribe = client.on("view", listener);

    const media = {
      id: "1",
      type: "photo" as const,
      width: 1920,
      height: 1080,
      url: "https://example.com/photo.jpg",
    };

    client.trackView(media);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      media,
    });

    unsubscribe();

    client.trackView(media);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("emits download events", () => {
    const client = new MediaClient({
      apiKey: "test-key",
    });

    const listener = vi.fn();

    client.on("download", listener);

    const media = {
      id: "2",
      type: "photo" as const,
      width: 100,
      height: 100,
      url: "https://example.com/photo.jpg",
    };

    client.trackDownload(media);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      media,
    });
  });

  it("does not return more than perPage items for all media types", async () => {
    const client = new MediaClient({
      apiKey: "test-key",
    });

    const clientWithMockedProvider = client as unknown as {
      provider: {
        searchPhotos: ReturnType<typeof vi.fn>;
        searchVideos: ReturnType<typeof vi.fn>;
      };
    };

    clientWithMockedProvider.provider.searchPhotos = vi.fn().mockResolvedValue({
      page: 1,
      per_page: 20,
      total_results: 20,
      photos: Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        width: 1920,
        height: 1080,
        url: `https://example.com/photo-${index}.jpg`,
        photographer: "John Doe",
        photographer_url: "https://example.com/photographer",
        photographer_id: 1,
        src: {
          original: `https://example.com/photo-${index}.jpg`,
          large: `https://example.com/photo-${index}.jpg`,
          medium: `https://example.com/photo-${index}.jpg`,
          small: `https://example.com/photo-${index}.jpg`,
          portrait: `https://example.com/photo-${index}.jpg`,
          landscape: `https://example.com/photo-${index}.jpg`,
          tiny: `https://example.com/photo-${index}.jpg`,
        },
        alt: "",
      })),
    });

    clientWithMockedProvider.provider.searchVideos = vi.fn().mockResolvedValue({
      page: 1,
      per_page: 20,
      total_results: 20,
      videos: Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        width: 1920,
        height: 1080,
        duration: 10,
        url: `https://example.com/video-${index}.jpg`,
        image: `https://example.com/video-${index}.jpg`,
        user: {
          id: 1,
          name: "John Doe",
          url: "https://example.com/photographer",
        },
        video_files: [
          {
            id: 1,
            quality: "hd",
            file_type: "video/mp4",
            width: 1920,
            height: 1080,
            fps: 30,
            link: `https://example.com/video-${index}.mp4`,
          },
        ],
        video_pictures: [],
      })),
    });

    const result = await client.search({
      query: "nature",
      type: "all",
      page: 1,
      perPage: 20,
    });

    expect(result.items).toHaveLength(20);
    expect(result.perPage).toBe(20);
  });

  it("throws MediaError when API key is missing", () => {
    expect(() => {
      new MediaClient({
        apiKey: "",
      });
    }).toThrow(MediaError);
  });
});
