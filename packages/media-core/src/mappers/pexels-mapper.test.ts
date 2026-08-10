import { describe, expect, it } from "vitest";

import {
  mapPexelsPhoto,
  mapPexelsVideo,
} from "./pexels-mapper.js";

describe("Pexels mapper", () => {
  it("maps a Pexels photo into MediaItem", () => {
    const result = mapPexelsPhoto({
      id: 123,
      width: 1920,
      height: 1080,
      url: "https://www.pexels.com/photo/123",
      photographer: "John Doe",
      photographer_url: "https://www.pexels.com/@john",
      photographer_id: 456,
      src: {
        original: "original.jpg",
        large2x: "large2x.jpg",
        large: "large.jpg",
        medium: "medium.jpg",
        small: "small.jpg",
        portrait: "portrait.jpg",
        landscape: "landscape.jpg",
        tiny: "tiny.jpg",
      },
      alt: "Football player",
    });

    expect(result).toEqual({
      id: "123",
      type: "photo",
      width: 1920,
      height: 1080,
      url: "large.jpg",
      thumbnailUrl: "medium.jpg",
      sourceUrl: "https://www.pexels.com/photo/123",
      photographer: {
        id: "456",
        name: "John Doe",
        url: "https://www.pexels.com/@john",
      },
    });
  });

  it("maps a Pexels video and selects an MP4 source", () => {
    const result = mapPexelsVideo({
      id: 789,
      width: 1080,
      height: 1920,
      url: "https://www.pexels.com/video/789",
      image: "preview.jpg",
      duration: 15,
      user: {
        id: 456,
        name: "Jane Doe",
        url: "https://www.pexels.com/@jane",
      },
      video_files: [
        {
          id: 1,
          quality: "sd",
          file_type: "video/mp4",
          width: 540,
          height: 960,
          link: "sd.mp4",
        },
        {
          id: 2,
          quality: "hd",
          file_type: "video/mp4",
          width: 1080,
          height: 1920,
          link: "hd.mp4",
        },
      ],
      video_pictures: [],
    });

    expect(result.type).toBe("video");
    expect(result.videoUrl).toBe("hd.mp4");
    expect(result.thumbnailUrl).toBe("preview.jpg");
    expect(result.duration).toBe(15);
  });
});