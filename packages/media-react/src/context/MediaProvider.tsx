import { createContext, useContext, useMemo, type ReactNode } from "react";

import {
  createMediaClient,
  type MediaClient,
  type MediaClientOptions,
} from "@fotoowl/media-core";

const MediaClientContext = createContext<MediaClient | null>(null);

export interface MediaProviderProps
  extends MediaClientOptions {
  children: ReactNode;
  client?: MediaClient;
}

export function MediaProvider({
  children,
  apiKey,
  cacheTtlMs,
  client: providedClient,
}: MediaProviderProps) {
  const client = useMemo(
    () =>
      providedClient ??
      createMediaClient({
        apiKey,
        cacheTtlMs,
      }),
    [providedClient, apiKey, cacheTtlMs],
  );

  return (
    <MediaClientContext.Provider value={client}>
      {children}
    </MediaClientContext.Provider>
  );
}

export function useMediaClient(): MediaClient {
  const client = useContext(MediaClientContext);

  if (!client) {
    throw new Error("useMediaClient must be used inside MediaProvider.");
  }

  return client;
}
