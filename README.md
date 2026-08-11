# FotoOwl Media SDK

A small, framework-agnostic media SDK built for the FotoOwl technical assignment.

The project separates media/data logic from UI components so the same SDK can
be consumed from React, React Native, or another framework in the future.

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

skills/
  media-data-wiring/      # AI guidance for SDK/data integration
    SKILL.md
  media-ui-components/    # AI guidance for UI component usage
    SKILL.md
Architecture

The application intentionally separates data access from UI presentation:

                         Web App
                        /       \
                       /         \
                      ↓           ↓
              media-react    media-ui-react
                   ↓
              media-core
                   ↓
               Pexels API

The React Native packages follow the same separation:

                  React Native App
                     /        \
                    /          \
                   ↓            ↓
            media-native    media-ui-native
                 ↓
            media-core
                 ↓
             Pexels API
Dependency Direction

The repository maintains clear package boundaries:

Application
├── media-react
│   └── media-core
│
└── media-ui-react

The same principle applies to React Native:

React Native Application
├── media-native
│   └── media-core
│
└── media-ui-native

The UI packages do not import media-core, media-react, or
media-native.

The wrapper packages are responsible for connecting framework-specific
application code to the framework-agnostic SDK.

The application composes the data layer and UI layer.

Core SDK

media-core is independent of React and React Native.

It is responsible for:

Pexels API requests
Pexels response mapping
SDK-owned media types
Pagination
Error handling
API key validation
In-memory caching
Request deduplication
Media events
View and download tracking
Core API

The main client can be created with:

const client = createMediaClient({
  apiKey: "YOUR_PEXELS_API_KEY",
});

The SDK supports:

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

client.on("view", (event) => {
  console.log(event.media);
});

client.trackView(media);

client.trackDownload(media);

Subscriptions return an unsubscribe function:

const unsubscribe = client.on("view", (event) => {
  console.log(event.media);
});

client.trackView(media);

unsubscribe();

The SDK normalizes Pexels responses into SDK-owned types such as
MediaItem and MediaPage.

Consumers therefore do not need to depend directly on Pexels-specific
response structures.

Supported Features

The SDK includes:

Pexels photo and video search
Curated photo results
Pagination and load-more support
Single media item lookup
Typed SDK-owned media models
API key validation
Normalized error handling
In-memory caching
Request deduplication
View and download events
Event subscription and unsubscribe support
React and React Native data adapters
Reusable React and React Native UI components
React Data Layer

The React package provides:

MediaProvider
useMediaClient
useMediaSearch
useMediaItem

Example:

<MediaProvider apiKey="YOUR_PEXELS_API_KEY">
  <App />
</MediaProvider>

Searching media:

const {
  data,
  loading,
  loadingMore,
  error,
  hasNextPage,
  loadMore,
  refetch,
} = useMediaSearch({
  query: "nature",
  type: "photo",
  perPage: 20,
});

Pagination is handled through loadMore().

The hook also exposes loading, error, pagination, and refetch state so the
consuming application can control its own presentation.

UI Components

The React UI package contains:

MediaSearch
MediaCard
MediaGrid
MediaLightbox
MediaReel

The UI package is independent of the data layer.

Components receive media data and callbacks through props and do not perform
Pexels requests themselves.

Example:

<MediaGrid
  items={data?.items ?? []}
  className="media-grid"
  itemClassName="media-card"
  onSelect={setSelectedMedia}
  hasNextPage={hasNextPage}
  loadingMore={loadingMore}
  onLoadMore={() => {
    void loadMore();
  }}
/>

The consuming application controls the surrounding application state and
visual styling.

UI Component Responsibilities

MediaSearch

Handles search input and submission
Exposes loading state
Allows the consuming application to control styling

MediaCard

Renders an individual media item
Supports selection callbacks
Supports custom content

MediaGrid

Renders a collection of media items
Supports item selection
Supports load-more behavior
Allows custom item styling/content

MediaLightbox

Displays the selected media
Supports image and video previews
Exposes close behavior

MediaReel

Renders a media reel
Supports active-item tracking
Supports video playback for active items
Supports custom item rendering
Headless / Unstyled UI Approach

The UI packages are kept separate from the SDK data layer and do not contain
application-specific visual design.

The consuming application owns:

Layout
Spacing
Colors
Typography
Responsive behavior
Component styling
Application-specific presentation

The components expose class-name and rendering customization points where
appropriate so applications can adapt the presentation without coupling the
UI package to the web application's stylesheet.

The implementation intentionally keeps the UI package focused on reusable
media behavior rather than shipping an application-specific design system.

Web Demo

The working demo is located in:

apps/web

The demo demonstrates:

Media search
Photo and video search modes
Loading states
Error handling
Results rendering
Media selection
Lightbox preview
Video reel/swiper experience
Active video detection
Pagination
Load-more behavior
Pexels attribution

Create a local environment file:

apps/web/.env

Add your Pexels API key:

VITE_PEXELS_API_KEY=YOUR_PEXELS_API_KEY

The .env file should not be committed.

Start the demo with:

pnpm --filter @fotoowl/web dev
React Native

The project also contains React Native packages:

packages/media-native
packages/media-ui-native

media-native provides the React Native data layer on top of the
framework-agnostic core.

media-ui-native provides reusable React Native UI components.

The Native UI package can be consumed independently from the React web UI
package.

Development

Install dependencies:

pnpm install

Run type checking:

pnpm typecheck

Run tests:

pnpm test

Build all packages:

pnpm build
Implementation Decisions
Framework-independent core

The core SDK does not depend on React or React Native.

This keeps the main API reusable across different environments.

SDK-owned types

Pexels responses are mapped into SDK-owned models such as MediaItem and
MediaPage.

This prevents consumers from becoming tightly coupled to the provider's
response format and makes it easier to replace the provider in the future.

Caching

The core SDK includes a small in-memory cache with configurable TTL support.

Repeated requests can return cached results instead of making another network
request.

Request Deduplication

Concurrent requests for the same resource are deduplicated so multiple
consumers requesting the same data can share the same in-flight request.

Pagination

Search and curated results expose page information and hasNextPage.

For combined photo and video searches, the SDK ensures that the returned item
count does not exceed the requested perPage.

Events

The SDK provides view and download events:

const unsubscribe = client.on("view", (event) => {
  console.log(event.media);
});

client.trackView(media);

unsubscribe();

Subscriptions return an unsubscribe function so consumers can clean up
listeners.

React and UI Separation

The React data layer and UI components are kept separate.

This allows developers to use the SDK hooks with their own UI or use the
reusable components included in the project.

Scope and Trade-offs

The implementation prioritizes architectural boundaries and reusable SDK
contracts over visual polish.

The main priorities were:

Framework-agnostic core SDK
Thin React and React Native data adapters
Independent UI packages
Pagination and media interaction
Typed public APIs
Loading and error handling
Automated verification
AI-guided but manually reviewed implementation

Visual design was intentionally kept simple because visual polish is not the
primary focus of the assignment.

The implementation favors a small, explicit public API over additional
abstraction that would not provide meaningful value for the assignment.

AI-Assisted Development

AI coding tools were intentionally used during implementation and review.

AI-assisted work

AI was used to:

Review the SDK architecture against the assignment
Review the media-core public API
Review React and React Native package boundaries
Review component API design
Generate and refine component tests
Debug TypeScript and Vitest failures
Review accessibility behavior
Review loading and pagination behavior
Review the web application composition
Review dependency direction
Review documentation and submission readiness

All suggested implementation changes were reviewed and tested locally before
being accepted.

Human-authored decisions

The final architecture, package boundaries, public API decisions, scope,
trade-offs, and acceptance of implementation changes were reviewed and
decided by the candidate.

AI suggestions were treated as development assistance rather than as an
unreviewed source of truth.

AI Skills

Two reusable AI skills were created for the project:

skills/
├── media-data-wiring/
│   └── SKILL.md
│
└── media-ui-components/
    └── SKILL.md
media-data-wiring

The data-wiring skill guides an AI assistant on:

Configuring MediaProvider
Using the React data hooks
Handling loading and error states
Handling pagination
Refetching data
Connecting SDK data to application state
Keeping data access separate from UI presentation
media-ui-components

The UI-components skill guides an AI assistant on:

Selecting the appropriate reusable UI component
Passing media data through props
Handling selection and callbacks
Using the component customization API
Preserving accessibility behavior
Keeping styling in the consuming application
Avoiding direct SDK/data-layer imports from UI components

The skills were used to guide development and review of the apps/web
application and to maintain the separation between data access,
application state, and UI presentation.

Verification

The workspace was verified using:

pnpm typecheck
pnpm test
pnpm build

The final verification confirms that:

Workspace packages typecheck successfully
Automated tests pass
Packages build successfully
The web application produces a production build

The React UI package was also specifically verified with:

pnpm --filter @fotoowl/media-ui-react typecheck
pnpm --filter @fotoowl/media-ui-react test

The latest UI test suite passes all 14 tests.

Submission

The following links should be added before final submission:

GitHub Repository: TODO
Live Web App: TODO
SDK Documentation: TODO
Component Documentation: TODO
AI Development Discussions: TODO

These will be replaced with the final deployed URLs and relevant AI
development discussion links before submission.




