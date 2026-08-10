import type { ReactNode } from "react";

import type { MediaItem } from "../types/media.js";

import {
  MediaCard,
  type MediaCardProps,
} from "./MediaCard.js";

export interface MediaGridProps {
  items: MediaItem[];
  onSelect?: MediaCardProps["onSelect"];
  columns?: number;
  className?: string;
  itemClassName?: string;
  children?: ReactNode;
}

export function MediaGrid({
  items,
  onSelect,
  className,
  itemClassName,
  children,
}: MediaGridProps) {
  return (
    <div className={className}>
      {children ??
        items.map((media) => (
          <MediaCard
            key={`${media.type}-${media.id}`}
            media={media}
            onSelect={onSelect}
            className={itemClassName}
            imageClassName="media-card-image"
            videoBadgeClassName="media-card-video-badge"
            photographerClassName="media-card-photographer"
          />
        ))}
    </div>
  );
}