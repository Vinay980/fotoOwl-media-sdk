export type MediaType = "photo" | "video";

export interface MediaPhotographer {
  id?: string;
  name: string;
  url?: string;
}

export interface MediaItem {
  id: string;
  type: MediaType;
  width: number;
  height: number;
  url: string;
  thumbnailUrl?: string;
  sourceUrl?: string;
  videoUrl?: string;
  duration?: number;
  photographer?: MediaPhotographer;
}

export interface MediaPage {
  items: MediaItem[];
  page: number;
  perPage: number;
  totalResults?: number;
  hasNextPage: boolean;
}