import { MediaError } from "../errors/media-error.js";

import type {
  PexelsPhoto,
  PexelsPhotoPage,
  PexelsVideo,
  PexelsVideoPage,
} from "./pexels-types.js";

const PEXELS_API_URL = "https://api.pexels.com/v1";

export class PexelsProvider {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey.trim()) {
      throw new MediaError(
        "INVALID_API_KEY",
        "A Pexels API key is required.",
      );
    }

    this.apiKey = apiKey;
  }

  async searchPhotos(
    query: string,
    page: number,
    perPage: number,
  ): Promise<PexelsPhotoPage> {
    const params = new URLSearchParams({
      query,
      page: String(page),
      per_page: String(perPage),
    });

    return this.request<PexelsPhotoPage>(
      `/search?${params.toString()}`,
    );
  }

  async searchVideos(
    query: string,
    page: number,
    perPage: number,
  ): Promise<PexelsVideoPage> {
    const params = new URLSearchParams({
      query,
      page: String(page),
      per_page: String(perPage),
    });

    return this.request<PexelsVideoPage>(
      `/videos/search?${params.toString()}`,
    );
  }

  async getCuratedPhotos(
    page: number,
    perPage: number,
  ): Promise<PexelsPhotoPage> {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });

    return this.request<PexelsPhotoPage>(
      `/curated?${params.toString()}`,
    );
  }

  async getPhoto(id: string): Promise<PexelsPhoto> {
    return this.request<PexelsPhoto>(`/photos/${id}`);
  }

  async getVideo(id: string): Promise<PexelsVideo> {
    return this.request<PexelsVideo>(`/videos/videos/${id}`);
  }

  private async request<T>(path: string): Promise<T> {
    let response: Response;

    try {
      response = await fetch(`${PEXELS_API_URL}${path}`, {
        headers: {
          Authorization: this.apiKey,
        },
      });
    } catch {
      throw new MediaError(
        "NETWORK_ERROR",
        "Unable to connect to the Pexels API.",
      );
    }

    if (!response.ok) {
      throw this.mapHttpError(response.status);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new MediaError(
        "API_ERROR",
        "Pexels returned an invalid response.",
        response.status,
      );
    }
  }

  private mapHttpError(status: number): MediaError {
    if (status === 401) {
      return new MediaError(
        "UNAUTHORIZED",
        "The Pexels API key is invalid or unauthorized.",
        status,
      );
    }

    if (status === 404) {
      return new MediaError(
        "NOT_FOUND",
        "The requested media was not found.",
        status,
      );
    }

    if (status === 429) {
      return new MediaError(
        "RATE_LIMITED",
        "The Pexels API rate limit has been reached.",
        status,
      );
    }

    if (status >= 400 && status < 500) {
      return new MediaError(
        "INVALID_REQUEST",
        "The request to Pexels was invalid.",
        status,
      );
    }

    return new MediaError(
      "API_ERROR",
      "The Pexels API returned an error.",
      status,
    );
  }
}