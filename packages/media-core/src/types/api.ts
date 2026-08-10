import type { MediaItem, MediaPage, MediaType } from "./media.js";

export interface SearchParams {
  query: string;
  type?: MediaType | "all";
  page?: number;
  perPage?: number;
}

export interface CuratedParams {
  page?: number;
  perPage?: number;
}

export type SearchResult = Promise<MediaPage>;
export type CuratedResult = Promise<MediaPage>;
export type MediaResult = Promise<MediaItem>;