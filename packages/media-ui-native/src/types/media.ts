export interface MediaItem {
  id: string;
  type: "photo" | "video";
  width: number;
  height: number;
  url: string;
  thumbnailUrl?: string;
  sourceUrl?: string;
  videoUrl?: string;
  duration?: number;
  photographer?: {
    id?: string;
    name: string;
    url?: string;
  };
}