import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from "react-native";

import type { MediaItem } from "../types/media.js";

export interface MediaReelProps {
  items: MediaItem[];
  onActiveChange?: (
    index: number,
    media: MediaItem,
  ) => void;
}

export function MediaReel({
  items,
  onActiveChange,
}: MediaReelProps) {
  const handleViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{
      index: number | null;
    }>;
  }) => {
    const index = viewableItems[0]?.index;

    if (index === null || index === undefined) {
      return;
    }

    const media = items[index];

    if (media) {
      onActiveChange?.(index, media);
    }
  };

  const renderItem: ListRenderItem<MediaItem> = ({
    item,
  }) => (
    <View style={styles.item}>
      <Image
        source={{
          uri: item.url,
        }}
        accessibilityLabel={
          item.photographer
            ? `Photo by ${item.photographer.name}`
            : "Media preview"
        }
        style={styles.image}
      />

      {item.type === "video" && (
        <View style={styles.videoBadge}>
          <Text style={styles.videoText}>
            Video
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) =>
        `${item.type}-${item.id}`
      }
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={
        handleViewableItemsChanged
      }
      viewabilityConfig={{
        itemVisiblePercentThreshold: 80,
      }}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    height: 600,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  videoBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  videoText: {
    color: "#ffffff",
    fontSize: 12,
  },
});