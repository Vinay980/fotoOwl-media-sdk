import { describe, expect, it, vi } from "vitest";

import { MediaError } from "../errors/media-error.js";
import { PexelsProvider } from "./pexels-provider.js";

describe("PexelsProvider", () => {
  it("requires an API key", () => {
    expect(() => new PexelsProvider("")).toThrow(MediaError);

    try {
      new PexelsProvider("");
    } catch (error) {
      expect(error).toBeInstanceOf(MediaError);

      expect((error as MediaError).code).toBe(
        "INVALID_API_KEY",
      );
    }
  });

  it("searches photos with the correct endpoint", async () => {
    const response = {
      page: 1,
      per_page: 1,
      total_results: 1,
      photos: [],
    };

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify(response), {
          status: 200,
        }),
      );

    const provider = new PexelsProvider("test-key");

    const result = await provider.searchPhotos(
      "football",
      1,
      20,
    );

    expect(result).toEqual(response);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.pexels.com/v1/search?query=football&page=1&per_page=20",
      {
        headers: {
          Authorization: "test-key",
        },
      },
    );

    fetchMock.mockRestore();
  });

  it("maps unauthorized responses to MediaError", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response("Unauthorized", {
          status: 401,
        }),
      );

    const provider = new PexelsProvider("bad-key");

    await expect(
      provider.searchPhotos("football", 1, 20),
    ).rejects.toMatchObject({
      code: "UNAUTHORIZED",
      status: 401,
    });

    fetchMock.mockRestore();
  });

  it("maps rate limiting responses to MediaError", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response("Too many requests", {
          status: 429,
        }),
      );

    const provider = new PexelsProvider("test-key");

    await expect(
      provider.searchPhotos("football", 1, 20),
    ).rejects.toMatchObject({
      code: "RATE_LIMITED",
      status: 429,
    });

    fetchMock.mockRestore();
  });
});