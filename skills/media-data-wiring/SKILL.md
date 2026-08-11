# FotoOwl Media Data Wiring Skill

## Purpose

Use this skill when building or modifying an application that consumes FotoOwl's React media SDK.

This skill defines how application code connects:

- `@fotoowl/media-react`
- `@fotoowl/media-core`
- `@fotoowl/media-ui-react`

The application owns composition and state. The SDK owns media data access. The UI package owns presentation and interaction.

## 1. Architecture

The intended dependency direction is:

```text
Application
├── @fotoowl/media-react
│   └── @fotoowl/media-core
│
└── @fotoowl/media-ui-react
```

Application code may import the React data layer and reusable UI package. `media-ui-react` must remain independent of `media-react` and `media-core`.

Do not put API or network logic inside reusable UI components.

## 2. MediaProvider

Initialize the React SDK at the application boundary:

```tsx
import { MediaProvider } from "@fotoowl/media-react";

<MediaProvider apiKey={import.meta.env.VITE_PEXELS_API_KEY ?? ""}>
  <App />
</MediaProvider>
```

The provider accepts:

```ts
interface MediaProviderProps {
  children: ReactNode;
  apiKey: string;
  cacheTtlMs?: number;
  client?: MediaClient;
}
```

Do not hard-code credentials or put API keys in reusable UI components.

## 3. useMediaClient

Use `useMediaClient()` inside `MediaProvider` when application-level access to the SDK client is required.

```tsx
const client = useMediaClient();
```

Do not create a second client when the provider already supplies one.

## 4. useMediaSearch

Use `useMediaSearch()` for searches:

```tsx
const {
  data,
  loading,
  loadingMore,
  error,
  hasNextPage,
  loadMore,
  refetch,
} = useMediaSearch({
  query,
  type: "photo",
  perPage: 20,
});
```

The hook starts at page 1 and owns request lifecycle and stale-response protection.

Do not call Pexels directly from application components or UI components.

## 5. Loading and errors

Use `loading` for the initial/current request and `loadingMore` for pagination.

```tsx
{loading && !data && <p>Loading media...</p>}
{loadingMore && <p>Loading more...</p>}
{error && <p role="alert">{error.message}</p>}
```

The application decides how errors are presented.

## 6. Pagination

Use `hasNextPage` and `loadMore()` together:

```tsx
<MediaGrid
  items={data?.items ?? []}
  hasNextPage={hasNextPage}
  loadingMore={loadingMore}
  onLoadMore={() => void loadMore()}
/>
```

Do not implement page counters or network requests inside `MediaGrid`.

## 7. Refetching

Use `refetch()` to repeat the current search from page one rather than duplicating request logic.

```tsx
<button type="button" onClick={() => void refetch()}>
  Retry
</button>
```

## 8. Application-owned state

The application owns:

- query
- media type
- selected media
- active reel index
- UI filters
- presentation state

Reset dependent state when query or media type changes so stale selections do not survive a new result set.

## 9. Composing data with UI

The preferred flow is:

```text
Environment
    ↓
MediaProvider
    ↓
useMediaSearch / useMediaItem
    ↓
Application state
    ↓
MediaGrid / MediaReel
    ↓
MediaLightbox
```

The application is the composition boundary. The SDK owns fetching. The UI package receives data and callbacks through props.

## 10. useMediaItem

Use the exact public contract exposed by `packages/media-react/src/hooks/useMediaItem.ts`. Do not invent parameters or return values. Do not recreate its fetching logic manually.

## 11. Activity tracking

Activity tracking belongs to the SDK/application layer:

```tsx
const client = useMediaClient();
client.trackView(media);
client.trackDownload(media);
```

Do not create a second analytics/event system inside reusable UI components.

## 12. Caching

Configure caching at the SDK/provider level:

```tsx
<MediaProvider apiKey={apiKey} cacheTtlMs={300000}>
  <App />
</MediaProvider>
```

Do not create a second media cache inside UI components.

## 13. Dependency rules

Correct:

```text
Application
├── media-react
│   └── media-core
└── media-ui-react
```

Incorrect:

```text
media-ui-react
├── media-react
└── media-core
```

The UI package must remain data-source independent.

## 14. Implementation checklist

Before modifying application data wiring, verify:

- MediaProvider initializes the client.
- API keys come from application configuration.
- `useMediaSearch` handles searches.
- `useMediaItem` handles single-item retrieval.
- Pagination uses `loadMore()`.
- Initial loading and pagination loading are distinct.
- Errors are handled by the application.
- `refetch()` is used instead of duplicate request logic.
- Selection and reel state remain application-owned.
- UI components receive data through props.
- UI components contain no API/network logic.
- UI components do not import `media-react` or `media-core`.
- Activity tracking and caching stay in the SDK/application layer.
- Existing public APIs are preserved unless a deliberate architectural change is required.
