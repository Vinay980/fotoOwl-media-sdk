import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { MediaItem } from "../types/media.js";

export interface MediaCardProps {
  media: MediaItem;
  onSelect?: (media: MediaItem) => void;
}

export function MediaCard({
  media,
  onSelect,
}: MediaCardProps) {
  return (
    <Pressable
      onPress={() => onSelect?.(media)}
      disabled={!onSelect}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              media.thumbnailUrl ??
              media.url,
          }}
          accessibilityLabel={
            media.photographer
              ? `Photo by ${media.photographer.name}`
              : "Media preview"
          }
          style={styles.image}
        />

        {media.type === "video" && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Video
            </Text>
          </View>
        )}
      </View>

      {media.photographer && (
        <Text style={styles.photographer}>
          {media.photographer.name}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },

  imageContainer: {
    position: "relative",
    aspectRatio: 16 / 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  badgeText: {
    color: "#ffffff",
    fontSize: 12,
  },

  photographer: {
    padding: 12,
    color: "#4b5563",
    fontSize: 14,
  },
});