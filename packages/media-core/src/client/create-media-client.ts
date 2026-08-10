import {
  MediaClient,
  type MediaClientOptions,
} from "./media-client.js";

export function createMediaClient(
  options: MediaClientOptions,
): MediaClient {
  return new MediaClient(options);
}