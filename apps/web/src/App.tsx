import { useState } from "react";

import { useMediaSearch } from "@fotoowl/media-react";

import {
  MediaGrid,
  MediaLightbox,
  MediaReel,
  MediaSearch,
} from "@fotoowl/media-ui-react";

import type { MediaItem } from "@fotoowl/media-ui-react";

type SearchType = "photo" | "video";

export default function App() {
  const [query, setQuery] = useState("nature");

  const [type, setType] = useState<SearchType>("photo");

  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const { data, loading, loadingMore, error, hasNextPage, loadMore } =
    useMediaSearch({
      query,
      type,
      perPage: 20,
    });

  const handleSearch = (nextQuery: string) => {
    setQuery(nextQuery);
    setSelectedMedia(null);
    setActiveVideoIndex(0);
  };

  const handleTypeChange = (nextType: SearchType) => {
    setType(nextType);
    setSelectedMedia(null);
    setActiveVideoIndex(0);
  };

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">FotoOwl Media SDK</p>

        <h1>Search reusable media components.</h1>

        <p className="subtitle">
          A framework-agnostic media core with React adapters and reusable UI.
        </p>

        <MediaSearch
          onSearch={handleSearch}
          loading={loading}
          initialQuery={query}
          className="search-form"
          inputClassName="search-input"
          buttonClassName="search-button"
        />

        <div
          className="media-type-selector"
          role="group"
          aria-label="Media type"
        >
          <button
            type="button"
            className={
              type === "photo"
                ? "media-type-button active"
                : "media-type-button"
            }
            onClick={() => handleTypeChange("photo")}
          >
            Photos
          </button>

          <button
            type="button"
            className={
              type === "video"
                ? "media-type-button active"
                : "media-type-button"
            }
            onClick={() => handleTypeChange("video")}
          >
            Videos
          </button>
        </div>
      </header>

      <section className="results">
        {loading && !data && <p className="status">Loading media...</p>}

        {error && (
          <p className="error" role="alert">
            {error.message}
          </p>
        )}

        {data && (
          <>
            <div className="results-header">
              <h2>
                {type === "video" ? "Video" : "Photo"} results for "{query}"
              </h2>

              <span>{data.totalResults ?? 0} results</span>
            </div>

            {type === "photo" ? (
              <MediaGrid
                items={data.items}
                className="media-grid"
                itemClassName="media-card"
                onSelect={setSelectedMedia}
                hasNextPage={hasNextPage}
                loadingMore={loadingMore}
                onLoadMore={() => {
                  void loadMore();
                }}
              />
            ) : (
              <MediaReel
                items={data.items}
                activeIndex={activeVideoIndex}
                onActiveChange={(index) => {
                  setActiveVideoIndex(index);
                }}
                className="video-reel"
                itemClassName="video-reel-item"
              />
            )}

            <p className="attribution">
              Photos and videos provided by{" "}
              <a
                href="https://www.pexels.com/"
                target="_blank"
                rel="noreferrer"
              >
                Pexels
              </a>
            </p>
          </>
        )}
      </section>

      <MediaLightbox
        media={selectedMedia}
        onClose={() => {
          setSelectedMedia(null);
        }}
        className="media-lightbox"
      />
    </main>
  );
}
