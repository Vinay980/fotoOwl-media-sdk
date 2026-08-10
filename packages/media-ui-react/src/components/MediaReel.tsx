import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import type { MediaItem } from "../types/media.js";

export interface MediaReelProps {
  items: MediaItem[];
  activeIndex?: number;
  onActiveChange?: (
    index: number,
    media: MediaItem,
  ) => void;
  className?: string;
  children?: (media: MediaItem, index: number) => ReactNode;
}

export function MediaReel({
  items,
  activeIndex = 0,
  onActiveChange,
  className,
  children,
}: MediaReelProps) {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((element, index) => {
      if (!element) {
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) {
            return;
          }

          const media = items[index];

          if (media) {
            onActiveChange?.(index, media);
          }
        },
        {
          threshold: 0.7,
        },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => {
        observer.disconnect();
      });
    };
  }, [items, onActiveChange]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {items.map((media, index) => (
        <div
          key={`${media.type}-${media.id}`}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
        >
          {children ? (
            children(media, index)
          ) : media.type === "video" && media.videoUrl ? (
            <video
              src={media.videoUrl}
              controls
              muted={index !== activeIndex}
              autoPlay={index === activeIndex}
              aria-label={`Video ${index + 1}`}
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
          )}
        </div>
      ))}
    </div>
  );
}