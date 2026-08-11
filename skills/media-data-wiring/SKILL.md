# FotoOwl Media Data Wiring Skill

## Purpose

Use this skill when building or modifying an application that consumes
FotoOwl's React media SDK.

This skill defines how application code should connect:

- `@fotoowl/media-react`
- `@fotoowl/media-core`
- `@fotoowl/media-ui-react`

The application is responsible for composition and state.
The SDK is responsible for media data access.
The UI package is responsible for presentation and user interaction.

---

## 1. Architecture

The intended dependency direction is:

```text
Application
├── @fotoowl/media-react
│   └── @fotoowl/media-core
│
└── @fotoowl/media-ui-react

The application is the composition layer.

Allowed

Application code may import:

```text

import {
  MediaProvider,
  useMediaClient,
  useMediaSearch,
  useMediaItem,
} from "@fotoowl/media-react";

and:
```text

import {
  MediaGrid,
  MediaCard,
  MediaLightbox,
  MediaReel,
  MediaSearch,
} from "@fotoowl/media-ui-react";

Not allowed

@fotoowl/media-ui-react must not import:
```text

@fotoowl/media-react

or:

@fotoowl/media-core

The UI components must remain reusable and data-source independent.

## 2. MediaProvider

The React SDK must be initialized at the application boundary.

Use:

```text
import { MediaProvider } from "@fotoowl/media-react";

<MediaProvider apiKey={apiKey}>
  <App />
</MediaProvider>

The provider accepts the following configuration:

interface MediaProviderProps {
  children: ReactNode;
  apiKey: string;
  cacheTtlMs?: number;
  client?: MediaClient;
}

MediaProvider creates the media client internally unless an existing
MediaClient is supplied.

Example:

const apiKey =
  import.meta.env.VITE_PEXELS_API_KEY;

<MediaProvider
  apiKey={apiKey ?? ""}
>
  <App />
</MediaProvider>
API key rules

Do:

const apiKey =
  import.meta.env.VITE_PEXELS_API_KEY;

Do not:

const apiKey = "my-secret-key";

Do not put credentials inside:

MediaGrid
MediaCard
MediaLightbox
MediaReel
MediaSearch

The UI layer should never know that Pexels is the underlying provider.

3. useMediaClient

useMediaClient() provides access to the configured MediaClient.

Example:

import {
  useMediaClient,
} from "@fotoowl/media-react";

function MediaActions() {
  const client = useMediaClient();

  // Use the SDK client here when application-level
  // access to the media client is required.

  return null;
}

It must be used inside MediaProvider.

If used outside the provider, the hook throws:

useMediaClient must be used inside MediaProvider.

Do not create another MediaClient manually inside application components
when a provider/client is already available.

4. useMediaSearch

Use useMediaSearch() for media search.

The public hook accepts the SDK's SearchParams:

const result = useMediaSearch({
  query,
  type,
  perPage,
});

The hook returns:

{
  data,
  loading,
  loadingMore,
  error,
  hasNextPage,
  loadMore,
  refetch,
}
Example
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

The application owns the search state:

const [query, setQuery] =
  useState("nature");

The application passes that state to the hook.

5. Search lifecycle

The hook automatically performs the initial search when its search parameters
change.

The first request uses:

page = 1

The hook tracks the current request and ignores stale responses.

Do not duplicate this request-management logic in application components.

Do not call the Pexels API directly.

Do not call client.search() from a UI component.

The intended flow is:

Application state
      ↓
useMediaSearch()
      ↓
MediaClient.search()
      ↓
MediaPage
      ↓
UI component
6. Loading states

There are two separate loading states.

Initial loading

Use:

loading

for the first/current search.

Example:

{loading && !data && (
  <p>Loading media...</p>
)}
Pagination loading

Use:

loadingMore

when loading another page.

Example:

{loadingMore && (
  <p>Loading more...</p>
)}

Do not replace loadingMore with loading.

They represent different UI states.

7. Error handling

The hook exposes:

error

which is either a MediaError or null.

Example:

{error && (
  <p role="alert">
    {error.message}
  </p>
)}

The application decides how the error should be presented.

Do not make reusable UI components responsible for API error formatting.

8. Pagination

The hook exposes:

hasNextPage

and:

loadMore()

Use them together.

Example:

<MediaGrid
  items={data?.items ?? []}
  hasNextPage={hasNextPage}
  loadingMore={loadingMore}
  onLoadMore={() => {
    void loadMore();
  }}
/>

loadMore() automatically requests the next page.

The hook prevents loading another page when:

the initial request is still loading
another pagination request is already running
there is no next page

Do not implement page counters in MediaGrid.

Do not call the API directly from MediaGrid.

The UI component only invokes the callback supplied by the application.

9. Refetching

The hook exposes:

refetch()

Use it when the application needs to repeat the current search from page one.

Example:

<button
  type="button"
  onClick={() => {
    void refetch();
  }}
>
  Retry
</button>

Do not implement a second search request manually.

10. Search state belongs to the application

The application should own:

query
media type
selected media
active reel index
UI filters
presentation state

Example:

type SearchType =
  | "photo"
  | "video";

const [query, setQuery] =
  useState("nature");

const [type, setType] =
  useState<SearchType>("photo");

Then:

const result =
  useMediaSearch({
    query,
    type,
    perPage: 20,
  });
11. Reset dependent UI state

When the search query or media type changes, reset state that belongs to
the previous result set.

Example:

const handleSearch = (
  nextQuery: string,
) => {
  setQuery(nextQuery);
  setSelectedMedia(null);
  setActiveVideoIndex(0);
};

When changing media type:

const handleTypeChange = (
  nextType: SearchType,
) => {
  setType(nextType);
  setSelectedMedia(null);
  setActiveVideoIndex(0);
};

This prevents stale media from remaining selected after a new search.

12. Connecting data to MediaGrid

The application composes the data hook with the UI component.

Example:

const {
  data,
  loading,
  loadingMore,
  error,
  hasNextPage,
  loadMore,
} = useMediaSearch({
  query,
  type: "photo",
  perPage: 20,
});

return (
  <>
    {loading && !data && (
      <p>Loading...</p>
    )}

    {error && (
      <p role="alert">
        {error.message}
      </p>
    )}

    {data && (
      <MediaGrid
        items={data.items}
        hasNextPage={hasNextPage}
        loadingMore={loadingMore}
        onLoadMore={() => {
          void loadMore();
        }}
      />
    )}
  </>
);

The important separation is:

useMediaSearch
    ↓
data + loading + pagination
    ↓
Application
    ↓
MediaGrid
13. Connecting selection to MediaLightbox

The application owns selected media.

Example:

const [
  selectedMedia,
  setSelectedMedia,
] = useState<MediaItem | null>(
  null,
);

Pass the callback to the grid:

<MediaGrid
  items={data.items}
  onSelect={setSelectedMedia}
/>

Then:

<MediaLightbox
  media={selectedMedia}
  onClose={() => {
    setSelectedMedia(null);
  }}
/>

Do not make MediaGrid control the lightbox.

Do not make MediaLightbox own application-level selection state.

14. Connecting video data to MediaReel

The application may select video search:

const [type, setType] =
  useState<"photo" | "video">(
    "video",
  );

Then:

const {
  data,
} = useMediaSearch({
  query,
  type: "video",
  perPage: 20,
});

Pass the results to MediaReel:

<MediaReel
  items={data?.items ?? []}
  activeIndex={activeVideoIndex}
  onActiveChange={(index) => {
    setActiveVideoIndex(index);
  }}
/>

MediaReel determines which item is active.

The application decides what to do with that information.

15. useMediaItem

useMediaItem is the React hook for retrieving a single media item.

Use the exact public contract exposed by:

packages/media-react/src/hooks/useMediaItem.ts

Do not recreate its fetching logic manually.

Do not call Pexels directly from the component.

When implementing code that uses useMediaItem, inspect the hook's actual
public TypeScript signature before generating usage examples.

16. Activity tracking

Activity tracking belongs to the media SDK/client layer.

If application code needs to record activity such as:

views
downloads

use the public MediaClient API exposed through:

const client =
  useMediaClient();

Do not implement a second analytics/event system inside UI components.

For example, do not put Pexels/API activity tracking directly into:

MediaCard
MediaGrid
MediaLightbox
MediaReel
MediaSearch

The UI should communicate user actions through callbacks.

The application or SDK layer decides how those actions are recorded.

17. Caching

Caching is configured at the SDK/provider level.

Example:

<MediaProvider
  apiKey={apiKey}
  cacheTtlMs={300000}
>
  <App />
</MediaProvider>

Do not create a second media cache inside UI components.

Do not cache Pexels responses independently inside MediaGrid.

The media client owns SDK-level caching and request deduplication.

18. Dependency rules
Application

May depend on:

media-react
media-ui-react
media-react

May depend on:

media-core
media-ui-react

Must not depend on:

media-core
media-react
Correct
apps/web
├── media-react
│   └── media-core
│
└── media-ui-react
Incorrect
media-ui-react
└── media-react

or:

media-ui-react
└── media-core
19. Do not put data logic into UI components

Never write:

function MediaGrid() {
  const {
    data,
  } = useMediaSearch(...);

  // ...
}

Instead:

function App() {
  const {
    data,
  } = useMediaSearch(...);

  return (
    <MediaGrid
      items={data?.items ?? []}
    />
  );
}

Never write:

function MediaCard() {
  fetch(...);
}

Never import:

import {
  createMediaClient,
} from "@fotoowl/media-core";

into the UI package.

20. AI implementation checklist

Before generating or modifying application data-wiring code, verify:

Is the media client initialized through MediaProvider?
Is the API key supplied by the application environment?
Is useMediaSearch used for searching?
Is useMediaItem used for single-item retrieval?
Is pagination controlled through loadMore()?
Is loadingMore distinguished from initial loading?
Is error handled at the application level?
Is refetch() used instead of duplicating request logic?
Is selected media owned by the application?
Is reel state owned by the application?
Are UI components receiving data through props?
Are UI components free of API/network logic?
Are UI components free of media-core imports?
Are UI components free of media-react imports?
Is SDK configuration kept out of reusable UI components?
Is activity tracking kept in the SDK/application layer?
Is caching kept in the SDK/client layer?
Does the implementation preserve the existing public API?

If any answer is "no", reconsider the implementation before proceeding.

21. Preferred complete composition

The preferred application structure is:

Environment
    │
    ▼
MediaProvider
    │
    ▼
useMediaSearch / useMediaItem
    │
    ▼
Application state
    │
    ├───────────────┐
    ▼               ▼
MediaGrid       MediaReel
    │               │
    ▼               ▼
selectedMedia   activeIndex
    │
    ▼
MediaLightbox

The application is the composition boundary.

The SDK owns data access.

The UI package owns presentation and interaction.

Core rule

Fetch and manage media data in media-react / media-core, compose that
data in the application, and keep media-ui-react focused on rendering and
user interaction.


### One important correction

I deliberately **did not document the exact `useMediaItem` parameters/return value**, because you haven't shown `useMediaItem.ts` yet. That's better than putting a fictional API into a required assignment deliverable.

Send:

```powershell
Get-Content packages\media-react\src\hooks\useMediaItem.ts

Then I'll make that section exact and we can consider media-data-wiring/SKILL.md finished.