import type { MediaItem } from "@fotoowl/media-core";

import {
  MediaCard,
  type MediaCardProps,
} from "./MediaCard.js";

export interface MediaGridProps {
  items: MediaItem[];
  onSelect?: MediaCardProps["onSelect"];
  columns?: number;
}

export function MediaGrid({
  items,
  onSelect,
  columns = 4,
}: MediaGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 16,
      }}
    >
      {items.map((media) => (
        <MediaCard
          key={`${media.type}-${media.id}`}
          media={media}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}