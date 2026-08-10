export type {
  MediaType,
  MediaPhotographer,
  MediaItem,
  MediaPage,
} from "./types/media.js";

export type {
  SearchParams,
  CuratedParams,
  SearchResult,
  CuratedResult,
  MediaResult,
} from "./types/api.js";

export type {
  MediaEventMap,
  MediaEventName,
  MediaEventListener,
} from "./types/events.js";

export {
  MediaError,
} from "./errors/media-error.js";

export type {
  MediaErrorCode,
} from "./errors/media-error.js";

export {
  MediaClient,
} from "./client/media-client.js";

export type {
  MediaClientOptions,
} from "./client/media-client.js";

export {
  createMediaClient,
} from "./client/create-media-client.js";