import type { ReactNode } from "react";

import type { MediaItem } from "../types/media.js";

export interface MediaLightboxProps {
  media: MediaItem | null;
  onClose: () => void;
  className?: string;
  children?: ReactNode;
}

export function MediaLightbox({
  media,
  onClose,
  className,
  children,
}: MediaLightboxProps) {
  if (!media) {
    return null;
  }

  return (
    <div
      className={className}
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="Close"
      >
        Close
      </button>

      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children ??
          (media.type === "video" &&
          media.videoUrl ? (
            <video
              src={media.videoUrl}
              controls
              autoPlay
              aria-label="Video preview"
            />
          ) : (
            <img
              src={media.url}
              alt={
                media.photographer
                  ? `Photo by ${media.photographer.name}`
                  : "Media preview"
              }
            />
          ))}
      </div>
    </div>
  );
}