import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import type { MediaItem } from "../types/media.js";

export interface MediaLightboxProps {
  media: MediaItem | null;
  onClose: () => void;
  overlayStyle?: StyleProp<ViewStyle>;
  mediaStyle?: StyleProp<ImageStyle>;
  closeButtonStyle?: StyleProp<ViewStyle>;
  closeTextStyle?: StyleProp<TextStyle>;
  badgeStyle?: StyleProp<ViewStyle>;
  badgeTextStyle?: StyleProp<TextStyle>;
}

export function MediaLightbox({
  media,
  onClose,
  overlayStyle,
  mediaStyle,
  closeButtonStyle,
  closeTextStyle,
  badgeStyle,
  badgeTextStyle,
}: MediaLightboxProps) {
  if (!media) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={overlayStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close media preview"
          onPress={onClose}
          style={closeButtonStyle}
        >
          <Text style={closeTextStyle}>Close</Text>
        </Pressable>

        <Image
          source={{
            uri:
              media.type === "video"
                ? media.thumbnailUrl ?? media.url
                : media.url,
          }}
          accessibilityLabel={
            media.photographer
              ? `Photo by ${media.photographer.name}`
              : "Media preview"
          }
          resizeMode="contain"
          style={mediaStyle}
        />

        {media.type === "video" && (
          <View style={badgeStyle}>
            <Text style={badgeTextStyle}>
              Video preview
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}