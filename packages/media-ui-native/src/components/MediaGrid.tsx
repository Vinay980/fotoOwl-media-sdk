import {
  FlatList,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
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
  contentContainerStyle?: StyleProp<ViewStyle>;
  columnWrapperStyle?: StyleProp<ViewStyle>;
}

export function MediaGrid({
  items,
  onSelect,
  columns = 2,
  onEndReached,
  contentContainerStyle,
  columnWrapperStyle,
}: MediaGridProps) {
  const renderItem: ListRenderItem<MediaItem> = ({ item }) => (
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
      columnWrapperStyle={columnWrapperStyle}
      contentContainerStyle={contentContainerStyle}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}