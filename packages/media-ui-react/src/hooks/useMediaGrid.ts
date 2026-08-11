import { useCallback } from "react";

import type { MediaItem } from "../types/media.js";

export interface UseMediaGridOptions {
  items: MediaItem[];
  onSelect?: (media: MediaItem) => void;
  hasNextPage?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export interface MediaGridRootProps {
  role: "list";
}

export interface MediaGridItemProps {
  role: "listitem";
  tabIndex: 0;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export interface MediaGridLoadMoreProps {
  role: "status";
  "aria-live": "polite";
}

export function useMediaGrid({
  items,
  onSelect,
  hasNextPage = false,
  loadingMore = false,
  onLoadMore,
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
      tabIndex: onSelect ? 0 : -1,
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

  const getLoadMoreProps = useCallback((): MediaGridLoadMoreProps => {
    if (hasNextPage && onLoadMore && !loadingMore) {
      onLoadMore();
    }

    return {
      role: "status",
      "aria-live": "polite",
    };
  }, [hasNextPage, loadingMore, onLoadMore]);

  return {
    items,
    getRootProps,
    getItemProps,
    getLoadMoreProps,
  };
}
