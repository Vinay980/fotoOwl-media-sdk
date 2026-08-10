import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  MediaError,
  MediaPage,
  SearchParams,
} from "@fotoowl/media-core";

import { useMediaClient } from "../context/MediaNativeProvider.js";

export interface UseMediaSearchResult {
  data: MediaPage | null;
  loading: boolean;
  loadingMore: boolean;
  error: MediaError | null;
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useMediaSearch(
  params: SearchParams,
): UseMediaSearchResult {
  const client = useMediaClient();

  const [data, setData] =
    useState<MediaPage | null>(null);

  const [loading, setLoading] = useState(false);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] =
    useState<MediaError | null>(null);

  const requestIdRef = useRef(0);

  const query = params.query;
  const type = params.type;
  const perPage = params.perPage;

  const load = useCallback(
    async (page: number, append: boolean) => {
      const requestId = ++requestIdRef.current;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const result = await client.search({
          query,
          type,
          perPage,
          page,
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        setData((previous) => {
          if (!append || !previous) {
            return result;
          }

          return {
            ...result,
            items: [
              ...previous.items,
              ...result.items,
            ],
          };
        });
      } catch (caughtError) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(caughtError as MediaError);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [client, query, type, perPage],
  );

  useEffect(() => {
    void load(1, false);
  }, [load]);

  const loadMore = useCallback(async () => {
    if (
      loading ||
      loadingMore ||
      !data?.hasNextPage
    ) {
      return;
    }

    await load(data.page + 1, true);
  }, [
    data,
    load,
    loading,
    loadingMore,
  ]);

  const refetch = useCallback(async () => {
    await load(1, false);
  }, [load]);

  return {
    data,
    loading,
    loadingMore,
    error,
    hasNextPage: data?.hasNextPage ?? false,
    loadMore,
    refetch,
  };
}