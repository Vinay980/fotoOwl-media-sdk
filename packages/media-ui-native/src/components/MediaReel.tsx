import {
  FlatList,
  Image,
  Text,
  View,
  type ListRenderItem,
  type StyleProp,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import type { MediaItem } from "../types/media.js";

export interface MediaReelProps {
  items: MediaItem[];
  onActiveChange?: (
    index: number,
    media: MediaItem,
  ) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  videoBadgeStyle?: StyleProp<ViewStyle>;
  videoTextStyle?: StyleProp<TextStyle>;
}

export function MediaReel({
  items,
  onActiveChange,
  contentContainerStyle,
  itemStyle,
  imageStyle,
  videoBadgeStyle,
  videoTextStyle,
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
    <View style={itemStyle}>
      <Image
        source={{
          uri: item.thumbnailUrl ?? item.url,
        }}
        accessibilityLabel={
          item.photographer
            ? `Photo by ${item.photographer.name}`
            : "Media preview"
        }
        resizeMode="contain"
        style={imageStyle}
      />

      {item.type === "video" && (
        <View style={videoBadgeStyle}>
          <Text style={videoTextStyle}>
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
      contentContainerStyle={contentContainerStyle}
    />
  );
}