import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  MediaError,
  MediaItem,
} from "@fotoowl/media-core";

import { useMediaClient } from "../context/MediaNativeProvider.js";

export interface UseMediaItemResult {
  data: MediaItem | null;
  loading: boolean;
  error: MediaError | null;
  refetch: () => Promise<void>;
}

export function useMediaItem(
  id: string | null | undefined,
): UseMediaItemResult {
  const client = useMediaClient();

  const [data, setData] =
    useState<MediaItem | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<MediaError | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await client.getById(id);

      setData(result);
    } catch (caughtError) {
      setError(caughtError as MediaError);
    } finally {
      setLoading(false);
    }
  }, [client, id]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    data,
    loading,
    error,
    refetch: load,
  };
}