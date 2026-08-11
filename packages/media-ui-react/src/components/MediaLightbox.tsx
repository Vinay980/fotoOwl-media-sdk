import { useEffect, useRef, type ReactNode } from "react";

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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!media) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
    };
  }, [media, onClose]);

  if (!media) return null;

  return (
    <div
      className={className}
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="Close media preview"
      >
        Close
      </button>

      <div onClick={(event) => event.stopPropagation()}>
        {children ??
          (media.type === "video" && media.videoUrl ? (
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
