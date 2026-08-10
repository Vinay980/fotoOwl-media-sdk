import type {
  KeyboardEvent,
  ReactNode,
} from "react";

import type { MediaItem } from "../types/media.js";

export interface MediaCardProps {
  media: MediaItem;
  onSelect?: (media: MediaItem) => void;
  className?: string;
  children?: ReactNode;
}

export function MediaCard({
  media,
  onSelect,
  className,
  children,
}: MediaCardProps) {
  const handleClick = () => {
    onSelect?.(media);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLElement>,
  ) => {
    if (
      onSelect &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      onSelect(media);
    }
  };

  return (
    <article
      className={className}
      onClick={handleClick}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      {children ?? (
        <>
          <img
            src={media.thumbnailUrl ?? media.url}
            alt={
              media.photographer
                ? `Photo by ${media.photographer.name}`
                : "Media preview"
            }
            loading="lazy"
          />

          {media.type === "video" && (
            <span aria-label="Video">
              Video
            </span>
          )}

          {media.photographer && (
            <p>{media.photographer.name}</p>
          )}
        </>
      )}
    </article>
  );
}