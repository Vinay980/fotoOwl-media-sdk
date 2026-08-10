import {
  Image,
  Pressable,
  Text,
  View,
  type ImageStyle,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import type { MediaItem } from "../types/media.js";

export interface MediaCardProps {
  media: MediaItem;
  onSelect?: (media: MediaItem) => void;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  badgeStyle?: StyleProp<ViewStyle>;
  badgeTextStyle?: StyleProp<TextStyle>;
}

export function MediaCard({
  media,
  onSelect,
  style,
  imageStyle,
  textStyle,
  badgeStyle,
  badgeTextStyle,
}: MediaCardProps) {
  const handlePress = () => {
    onSelect?.(media);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!onSelect}
      style={style}
      accessibilityRole={onSelect ? "button" : undefined}
    >
      <Image
        source={{
          uri: media.thumbnailUrl ?? media.url,
        }}
        accessibilityLabel={
          media.photographer
            ? `Photo by ${media.photographer.name}`
            : "Media preview"
        }
        style={imageStyle}
      />

      {media.type === "video" && (
        <View style={badgeStyle}>
          <Text style={badgeTextStyle}>Video</Text>
        </View>
      )}

      {media.photographer && (
        <Text style={textStyle}>
          {media.photographer.name}
        </Text>
      )}
    </Pressable>
  );
}