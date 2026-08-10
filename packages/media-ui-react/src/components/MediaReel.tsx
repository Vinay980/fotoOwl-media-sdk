import {
  useEffect,
  useRef,
} from "react";

import type { MediaItem } from "../types/media.js";

export interface MediaReelProps {
  items: MediaItem[];
  activeIndex?: number;
  onActiveChange?: (
    index: number,
    media: MediaItem,
  ) => void;
}

export function MediaReel({
  items,
  activeIndex = 0,
  onActiveChange,
}: MediaReelProps) {
  const itemRefs = useRef<
    Array<HTMLDivElement | null>
  >([]);

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
      observers.forEach((observer) =>
        observer.disconnect(),
      );
    };
  }, [items, onActiveChange]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        height: "80vh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
      }}
    >
      {items.map((media, index) => (
        <div
          key={`${media.type}-${media.id}`}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          style={{
            height: "80vh",
            position: "relative",
            scrollSnapAlign: "start",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
          }}
        >
          {media.type === "video" &&
          media.videoUrl ? (
            <video
              src={media.videoUrl}
              controls
              muted={index !== activeIndex}
              autoPlay={index === activeIndex}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <img
              src={media.url}
              alt={
                media.photographer
                  ? `Photo by ${media.photographer.name}`
                  : "Media preview"
              }
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}