import type { MediaItem } from "../types/media.js";

export interface MediaCardProps {
  media: MediaItem;
  onSelect?: (media: MediaItem) => void;
}

export function MediaCard({ media, onSelect }: MediaCardProps) {
  const handleClick = () => {
    onSelect?.(media);
  };

  return (
    <article
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        background: "#ffffff",
        cursor: onSelect ? "pointer" : "default",
      }}
      onClick={handleClick}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 10",
          overflow: "hidden",
        }}
      >
        <img
          src={media.thumbnailUrl ?? media.url}
          alt={
            media.photographer
              ? `Photo by ${media.photographer.name}`
              : "Media preview"
          }
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {media.type === "video" && (
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: "4px 8px",
              borderRadius: 999,
              background: "rgba(0, 0, 0, 0.7)",
              color: "#ffffff",
              fontSize: 12,
            }}
          >
            Video
          </span>
        )}
      </div>

      <div
        style={{
          padding: 12,
        }}
      >
        {media.photographer && (
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#4b5563",
            }}
          >
            {media.photographer.name}
          </p>
        )}
      </div>
    </article>
  );
}
