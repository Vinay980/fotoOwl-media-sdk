import type { MediaItem } from "./media.js";

export interface MediaEventMap {
  view: {
    media: MediaItem;
  };

  download: {
    media: MediaItem;
  };
}

export type MediaEventName = keyof MediaEventMap;

export type MediaEventListener<
  EventName extends MediaEventName
> = (event: MediaEventMap[EventName]) => void;