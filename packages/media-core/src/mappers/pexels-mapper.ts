import type { MediaItem, MediaPage } from "../types/media.js";
import type {
  PexelsPhoto,
  PexelsPhotoPage,
  PexelsVideo,
  PexelsVideoPage,
} from "../providers/pexels-types.js";

export function mapPexelsPhoto(photo: PexelsPhoto): MediaItem {
  return {
    id: String(photo.id),
    type: "photo",
    width: photo.width,
    height: photo.height,
    url: photo.src.large,
    thumbnailUrl: photo.src.medium,
    sourceUrl: photo.url,
    photographer: {
      id: String(photo.photographer_id),
      name: photo.photographer,
      url: photo.photographer_url,
    },
  };
}

export function mapPexelsVideo(video: PexelsVideo): MediaItem {
  const preferredVideo =
    video.video_files.find(
      (file) =>
        file.quality === "hd" &&
        file.file_type === "video/mp4",
    ) ??
    video.video_files.find(
      (file) => file.file_type === "video/mp4",
    ) ??
    video.video_files[0];

  return {
    id: String(video.id),
    type: "video",
    width: video.width,
    height: video.height,
    url: video.image,
    thumbnailUrl: video.image,
    sourceUrl: video.url,
    videoUrl: preferredVideo?.link,
    duration: video.duration,
    photographer: {
      id: String(video.user.id),
      name: video.user.name,
      url: video.user.url,
    },
  };
}

export function mapPexelsPhotoPage(
  response: PexelsPhotoPage,
): MediaPage {
  return {
    items: response.photos.map(mapPexelsPhoto),
    page: response.page,
    perPage: response.per_page,
    totalResults: response.total_results,
    hasNextPage: Boolean(response.next_page),
  };
}

export function mapPexelsVideoPage(
  response: PexelsVideoPage,
): MediaPage {
  return {
    items: response.videos.map(mapPexelsVideo),
    page: response.page,
    perPage: response.per_page,
    totalResults: response.total_results,
    hasNextPage: Boolean(response.next_page),
  };
}