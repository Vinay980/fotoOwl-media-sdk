import { useCallback, type KeyboardEvent } from "react";

import type { MediaItem } from "../types/media.js";

export interface UseMediaGridOptions {
  items: MediaItem[];
  onSelect?: (media: MediaItem) => void;
}

export interface MediaGridRootProps {
  role: "list";
}

export interface MediaGridItemProps {
  role: "listitem";
  tabIndex: 0;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
}

export function useMediaGrid({
  items,
  onSelect,
}: UseMediaGridOptions) {
  const getRootProps = useCallback(
    (): MediaGridRootProps => ({
      role: "list",
    }),
    [],
  );

  const getItemProps = useCallback(
    (media: MediaItem): MediaGridItemProps => ({
      role: "listitem",
      tabIndex: 0,
      onClick: () => onSelect?.(media),
      onKeyDown: (event) => {
        if (!onSelect) return;

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(media);
        }
      },
    }),
    [onSelect],
  );

  return {
    items,
    getRootProps,
    getItemProps,
  };
}
