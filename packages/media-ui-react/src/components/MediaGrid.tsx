import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";

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

  hasNextPage?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export function MediaGrid({
  items,
  onSelect,
  className,
  itemClassName,
  children,
  hasNextPage = false,
  loadingMore = false,
  onLoadMore,
}: MediaGridProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage || loadingMore || !onLoadMore) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !loadingMore) {
          onLoadMore();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, loadingMore, onLoadMore]);

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

      {hasNextPage && onLoadMore && (
        <div
          ref={loadMoreRef}
          className="media-grid-load-more"
          aria-hidden="true"
        >
          {loadingMore && (
            <span>Loading...</span>
          )}
        </div>
      )}
    </div>
  );
}