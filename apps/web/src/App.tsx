import { useState } from "react";

import { useMediaSearch } from "@fotoowl/media-react";
import { MediaGrid, MediaSearch } from "@fotoowl/media-ui-react";

export default function App() {
  const [query, setQuery] = useState("nature");

  const { data, loading, loadingMore, error, hasNextPage, loadMore } =
    useMediaSearch({
      query,
      type: "photo",
      perPage: 20,
    });

  const handleSearch = (nextQuery: string) => {
    setQuery(nextQuery);
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
              <h2>Results for "{query}"</h2>

              <span>{data.totalResults ?? 0} results</span>
            </div>

            <MediaGrid
              items={data.items}
              className="media-grid"
              itemClassName="media-card"
            />

            {hasNextPage && (
              <div className="load-more">
                <button
                  type="button"
                  onClick={() => {
                    void loadMore();
                  }}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}

            <p className="attribution">
              Photos provided by{" "}
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
    </main>
  );
}
