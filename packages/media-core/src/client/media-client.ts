import { MemoryCache } from "../cache/memory-cache.js";
import { RequestDeduplicator } from "../cache/request-deduplicator.js";
import { MediaError } from "../errors/media-error.js";
import { createDefaultEventListener } from "../events/default-listener.js";
import { EventEmitter } from "../events/emitter.js";
import {
  mapPexelsPhoto,
  mapPexelsPhotoPage,
  mapPexelsVideo,
  mapPexelsVideoPage,
} from "../mappers/pexels-mapper.js";
import { PexelsProvider } from "../providers/pexels-provider.js";
import type { CuratedParams, SearchParams } from "../types/api.js";
import type { MediaEventListener, MediaEventName } from "../types/events.js";
import type { MediaItem, MediaPage } from "../types/media.js";

export interface MediaClientOptions {
  apiKey: string;
  cacheTtlMs?: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 80;

export class MediaClient {
  private readonly provider: PexelsProvider;
  private readonly cache: MemoryCache;
  private readonly deduplicator: RequestDeduplicator;
  private readonly emitter: EventEmitter;

  constructor(options: MediaClientOptions) {
    this.provider = new PexelsProvider(options.apiKey);

    this.cache = new MemoryCache({
      ttlMs: options.cacheTtlMs,
    });

    this.deduplicator = new RequestDeduplicator();
    this.emitter = new EventEmitter();

    this.emitter.on("view", (event) => {
      createDefaultEventListener("view", event);
    });

    this.emitter.on("download", (event) => {
      createDefaultEventListener("download", event);
    });
  }

  async search(params: SearchParams): Promise<MediaPage> {
    const query = params.query.trim();

    if (!query) {
      throw new MediaError("INVALID_REQUEST", "Search query cannot be empty.");
    }

    const page = this.validatePage(params.page);
    const perPage = this.validatePerPage(params.perPage);
    const type = params.type ?? "all";

    const cacheKey = ["search", query, type, page, perPage].join("|");

    const cached = this.cache.get<MediaPage>(cacheKey);

    if (cached) {
      return cached;
    }

    return this.deduplicator.execute(cacheKey, async () => {
      const cachedAfterDedup = this.cache.get<MediaPage>(cacheKey);

      if (cachedAfterDedup) {
        return cachedAfterDedup;
      }

      let result: MediaPage;

      if (type === "photo") {
        const response = await this.provider.searchPhotos(query, page, perPage);

        result = mapPexelsPhotoPage(response);
      } else if (type === "video") {
        const response = await this.provider.searchVideos(query, page, perPage);

        result = mapPexelsVideoPage(response);
      } else {
        const [photoResponse, videoResponse] = await Promise.all([
          this.provider.searchPhotos(query, page, perPage),
          this.provider.searchVideos(query, page, perPage),
        ]);

        const photos = mapPexelsPhotoPage(photoResponse);

        const videos = mapPexelsVideoPage(videoResponse);

        result = {
          items: [...photos.items, ...videos.items].slice(0, perPage),
          page,
          perPage,
          totalResults: (photos.totalResults ?? 0) + (videos.totalResults ?? 0),
          hasNextPage: photos.hasNextPage || videos.hasNextPage,
        };
      }

      this.cache.set(cacheKey, result);

      return result;
    });
  }

  async curated(params: CuratedParams = {}): Promise<MediaPage> {
    const page = this.validatePage(params.page);
    const perPage = this.validatePerPage(params.perPage);

    const cacheKey = ["curated", page, perPage].join("|");

    const cached = this.cache.get<MediaPage>(cacheKey);

    if (cached) {
      return cached;
    }

    return this.deduplicator.execute(cacheKey, async () => {
      const cachedAfterDedup = this.cache.get<MediaPage>(cacheKey);

      if (cachedAfterDedup) {
        return cachedAfterDedup;
      }

      const response = await this.provider.getCuratedPhotos(page, perPage);

      const result = mapPexelsPhotoPage(response);

      this.cache.set(cacheKey, result);

      return result;
    });
  }

  async getById(id: string): Promise<MediaItem> {
    const normalizedId = id.trim();

    if (!normalizedId) {
      throw new MediaError("INVALID_REQUEST", "Media ID cannot be empty.");
    }

    const cacheKey = `media|${normalizedId}`;

    const cached = this.cache.get<MediaItem>(cacheKey);

    if (cached) {
      return cached;
    }

    return this.deduplicator.execute(cacheKey, async () => {
      const cachedAfterDedup = this.cache.get<MediaItem>(cacheKey);

      if (cachedAfterDedup) {
        return cachedAfterDedup;
      }

      try {
        const photo = await this.provider.getPhoto(normalizedId);

        const result = mapPexelsPhoto(photo);

        this.cache.set(cacheKey, result);

        return result;
      } catch (error) {
        if (!(error instanceof MediaError) || error.code !== "NOT_FOUND") {
          throw error;
        }
      }

      const video = await this.provider.getVideo(normalizedId);

      const result = mapPexelsVideo(video);

      this.cache.set(cacheKey, result);

      return result;
    });
  }

  on<EventName extends MediaEventName>(
    event: EventName,
    listener: MediaEventListener<EventName>,
  ): () => void {
    return this.emitter.on(event, listener);
  }

  trackView(media: MediaItem): void {
    this.emitter.emit("view", {
      media,
    });
  }

  trackDownload(media: MediaItem): void {
    this.emitter.emit("download", {
      media,
    });
  }

  private validatePage(page?: number): number {
    const value = page ?? DEFAULT_PAGE;

    if (!Number.isInteger(value) || value < 1) {
      throw new MediaError(
        "INVALID_REQUEST",
        "Page must be an integer greater than or equal to 1.",
      );
    }

    return value;
  }

  private validatePerPage(perPage?: number): number {
    const value = perPage ?? DEFAULT_PER_PAGE;

    if (!Number.isInteger(value) || value < 1 || value > MAX_PER_PAGE) {
      throw new MediaError(
        "INVALID_REQUEST",
        `perPage must be an integer between 1 and ${MAX_PER_PAGE}.`,
      );
    }

    return value;
  }
}
