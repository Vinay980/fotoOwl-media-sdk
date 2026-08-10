# FotoOwl Media SDK

A small, framework-agnostic media SDK built for the FotoOwl technical assignment.

The project separates the core media logic from the UI so the same SDK can be consumed from React, React Native, or another framework in the future.

The current implementation uses the Pexels API as the media provider.

## Project Structure

The project is organized as a pnpm monorepo:

```text
apps/
  web/                    # Web demo application

packages/
  media-core/             # Framework-agnostic SDK and Pexels integration
  media-react/            # React data layer
  media-native/           # React Native data layer
  media-ui-react/         # React UI components
  media-ui-native/        # React Native UI components
```

## Architecture

The main flow is:

```text
Web App
   ↓
media-ui-react
   ↓
media-react
   ↓
media-core
   ↓
Pexels API
```

`media-core` is independent of React and React Native. It is responsible for:

- API requests
- Pexels response mapping
- Pagination
- Error handling
- In-memory caching
- Request deduplication
- Media events

The React and React Native packages build on top of the core SDK instead of putting API logic directly inside UI components.

## Core API

The main client can be created with:

```ts
const client = createMediaClient({
  apiKey: "YOUR_PEXELS_API_KEY",
});
```

The SDK supports:

```ts
client.search({
  query: "nature",
  type: "photo",
  page: 1,
  perPage: 20,
});

client.curated({
  page: 1,
  perPage: 20,
});

client.getById("123");

client.on("view", listener);

client.trackView(media);

client.trackDownload(media);
```

The SDK normalizes Pexels responses into SDK-owned types such as `MediaItem` and `MediaPage`.

Consumers therefore do not need to depend directly on Pexels-specific response structures.

## Supported Features

The SDK includes:

- Pexels photo and video search
- Curated photo results
- Pagination and load-more support
- Single media item lookup
- Typed SDK-owned media models
- API key validation
- Normalized error handling
- In-memory caching
- Request deduplication
- View and download events
- Event subscription and unsubscribe support
- React and React Native adapters
- Reusable React and React Native UI components

## React Usage

The React package provides a provider and hooks for working with the SDK.

```tsx
<MediaProvider apiKey="YOUR_PEXELS_API_KEY">
  <App />
</MediaProvider>
```

For searching media:

```tsx
const {
  data,
  loading,
  loadingMore,
  error,
  hasNextPage,
  loadMore,
} = useMediaSearch({
  query: "nature",
  type: "photo",
  perPage: 20,
});
```

Pagination is handled through `loadMore()`, allowing the consuming application to request additional results without manually managing the page state.

## UI Components

The React UI package contains reusable components including:

- `MediaSearch`
- `MediaCard`
- `MediaGrid`
- `MediaLightbox`
- `MediaReel`

For example:

```tsx
<MediaGrid
  items={data?.items ?? []}
  columns={4}
/>
```

The UI package is separate from the data layer, so consumers can use the React hooks with their own components or use the provided UI components.

The React Native UI package provides equivalent reusable components built with React Native primitives.

## Web Demo

The working demo is located in:

```text
apps/web
```

The demo demonstrates:

- Media search
- Loading states
- Error handling
- Results rendering
- Pagination
- Load-more behavior
- Pexels attribution

Create a local environment file:

```text
apps/web/.env
```

Add your Pexels API key:

```env
VITE_PEXELS_API_KEY=YOUR_PEXELS_API_KEY
```

The `.env` file should not be committed.

Start the demo with:

```bash
pnpm --filter @fotoowl/web dev
```

## React Native

The project also contains React Native packages:

```text
packages/media-native
packages/media-ui-native
```

`media-native` provides the React Native data layer on top of the framework-agnostic core, while `media-ui-native` provides reusable React Native UI components.

The Native UI package can be consumed independently from the React web UI package.

## Development

Install dependencies:

```bash
pnpm install
```

Run type checking:

```bash
pnpm typecheck
```

Run tests:

```bash
pnpm test
```

Build all packages:

```bash
pnpm build
```

## Implementation Decisions

### Framework-independent core

The core SDK does not depend on React or React Native. This keeps the main API reusable across different environments.

### SDK-owned types

Pexels responses are mapped into SDK-owned models such as `MediaItem` and `MediaPage`.

This prevents consumers from becoming tightly coupled to the provider's response format and makes it easier to replace the provider in the future.

### Caching

The core SDK includes a small in-memory cache with configurable TTL support.

Repeated requests can return cached results instead of making another network request.

### Request Deduplication

Concurrent requests for the same resource are deduplicated so that multiple consumers requesting the same data at the same time can share the same in-flight request.

### Pagination

Search and curated results expose page information and `hasNextPage`.

For combined photo and video searches, the SDK ensures that the returned item count does not exceed the requested `perPage`.

### Events

The SDK provides view and download events:

```ts
const unsubscribe = client.on("view", (event) => {
  console.log(event.media);
});

client.trackView(media);

unsubscribe();
```

Subscriptions return an unsubscribe function so consumers can clean up listeners.

### React and UI Separation

The React data layer and UI components are kept separate.

This allows developers to use the SDK hooks with their own UI or use the reusable components included in the project.

## Verification

The project was verified using:

```bash
pnpm typecheck
pnpm test
pnpm build
```

The workspace typechecks successfully, the automated tests pass, and all packages and the web application build successfully.

## AI-Assisted Development

ChatGPT was used as an engineering assistant during development and review.

It was primarily used to:

- Review the SDK architecture against the assignment requirements
- Identify missing requirements and potential architectural issues
- Review API design and framework separation
- Suggest focused improvements
- Review tests and edge cases
- Assist with debugging
- Review documentation and submission readiness

All implementation changes were reviewed and tested locally before submission.

The ChatGPT prompt used during the assignment is provided separately as requested.