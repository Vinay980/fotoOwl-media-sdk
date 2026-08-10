import type { MediaItem } from "../types/media.js";

export interface MediaLightboxProps {
  media: MediaItem | null;
  onClose: () => void;
}

export function MediaLightbox({ media, onClose }: MediaLightboxProps) {
  if (!media) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(0, 0, 0, 0.85)",
        zIndex: 1000,
      }}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          padding: "8px 12px",
          border: 0,
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Close
      </button>

      {media.type === "video" && media.videoUrl ? (
        <video
          src={media.videoUrl}
          controls
          autoPlay
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
          onClick={(event) => event.stopPropagation()}
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
            maxWidth: "90vw",
            maxHeight: "90vh",
            objectFit: "contain",
          }}
          onClick={(event) => event.stopPropagation()}
        />
      )}
    </div>
  );
}
