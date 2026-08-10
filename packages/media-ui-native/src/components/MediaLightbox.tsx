import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { MediaItem } from "../types/media.js";

export interface MediaLightboxProps {
  media: MediaItem | null;
  onClose: () => void;
}

export function MediaLightbox({
  media,
  onClose,
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
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>
            Close
          </Text>
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
          style={styles.media}
        />

        {media.type === "video" && (
          <View style={styles.videoBadge}>
            <Text style={styles.videoText}>
              Video preview
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  media: {
    width: "92%",
    height: "75%",
  },

  closeButton: {
    position: "absolute",
    top: 48,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },

  closeText: {
    fontSize: 14,
  },

  videoBadge: {
    position: "absolute",
    bottom: 40,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  videoText: {
    color: "#ffffff",
    fontSize: 14,
  },
});