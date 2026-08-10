import {
  FlatList,
  type ListRenderItem,
} from "react-native";

import type { MediaItem } from "../types/media.js";

import {
  MediaCard,
  type MediaCardProps,
} from "./MediaCard.js";

export interface MediaGridProps {
  items: MediaItem[];
  onSelect?: MediaCardProps["onSelect"];
  columns?: number;
  onEndReached?: () => void;
}

export function MediaGrid({
  items,
  onSelect,
  columns = 2,
  onEndReached,
}: MediaGridProps) {
  const renderItem: ListRenderItem<MediaItem> = ({
    item,
  }) => (
    <MediaCard
      media={item}
      onSelect={onSelect}
    />
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) =>
        `${item.type}-${item.id}`
      }
      numColumns={columns}
      columnWrapperStyle={{
        gap: 12,
      }}
      contentContainerStyle={{
        gap: 12,
      }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}