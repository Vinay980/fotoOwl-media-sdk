#Media React Data Skill
##Purpose

Use this skill when working with the FotoOwl Media SDK React data layer.

The goal is to connect application data to the framework-agnostic media SDK without moving API logic into UI components or bypassing the existing architecture.

Architecture

The project uses this dependency direction:

App
↓
media-react
↓
media-core
↓
Pexels API

The React data layer must remain separate from UI components.

Do not put Pexels API requests, API keys, caching, request deduplication, or response mapping inside React components.

Do not make UI components responsible for fetching data.

##React Provider

Wrap the application with MediaProvider and provide the Pexels API key.

Example:

import { MediaProvider } from "@fotoowl/media-react";

<MediaProvider apiKey="YOUR_PEXELS_API_KEY"> <App /> </MediaProvider>

The API key belongs at the provider boundary.

Never hard-code a real API key into source code.

For the web demo, use the Vite environment variable:

VITE_PEXELS_API_KEY=YOUR_PEXELS_API_KEY

The .env file must not be committed.

Searching Media

Use useMediaSearch for media search.

Use the existing useMediaSearch API instead of creating a second search implementation inside the application.

Supported search types are:

photo
video
all

Do not call the Pexels API directly from React components.

Loading State

Use loading for the initial request.

Use loadingMore for pagination requests.

Do not treat initial loading and pagination loading as the same state.

Pagination

Use loadMore() when hasNextPage is true.

The consuming application should not manually duplicate the page state for normal pagination.

The React data layer should remain responsible for coordinating pagination with the underlying SDK.

Error Handling

Use the normalized error returned by the hook.

Display error.message when an error is present.

Do not expose raw Pexels-specific errors when the SDK already provides normalized errors.

Do not silently ignore errors.

Media Model

Use the SDK-owned MediaItem model.

MediaItem contains:

id
type
width
height
url
thumbnailUrl
sourceUrl
videoUrl
duration
photographer

The media type is photo or video.

Do not make UI components depend on Pexels-specific response structures.

The application should work with the SDK-owned media contract.

Media Page

Search results use the SDK-owned MediaPage model.

MediaPage contains:

items
page
perPage
totalResults
hasNextPage

Use items for rendering.

Use hasNextPage for pagination.

Use totalResults for result counts.

Use page and perPage only when application-level pagination information is required.

UI Separation

The data layer provides data and state.

UI components receive data through props.

Preferred flow:

useMediaSearch()
↓
data
↓
MediaGrid / MediaLightbox / MediaReel

Avoid this architecture:

MediaGrid
↓
Pexels API

UI components must not own API fetching.

The application composes the data layer and UI layer.

Core SDK Responsibilities

The underlying media-core package handles:

Pexels API requests
Pexels response normalization
Pagination
Error handling
In-memory caching
Request deduplication
View events
Download events

Do not duplicate these responsibilities in React components.

If a new feature requires provider-specific behavior, determine whether it belongs in media-core before adding it to media-react.

Events

The core client supports view and download events.

Subscriptions return an unsubscribe function.

When adding event-driven functionality, ensure subscriptions are cleaned up when appropriate.

Application Responsibility

The application decides how the returned data should be presented.

The data hook should not contain presentation-specific markup.

The UI package should not contain API-fetching logic.

Do Not

Do not:

Put Pexels API calls directly in React components.
Import Pexels-specific response types into UI components.
Hard-code API keys.
Duplicate caching logic in the React layer.
Duplicate request deduplication logic.
Duplicate the core provider implementation.
Manually reproduce the Pexels response mapping.
Make UI components responsible for API requests.
Couple media-ui-react directly to media-core.
Move framework-specific UI behavior into media-core.
Put presentation-specific markup into the data layer.
Create a second pagination implementation when loadMore() already provides the required behavior.
Adding New Data Features

When adding a new React data feature:

Determine whether the feature belongs in media-core.
Add or update the framework-agnostic core API when necessary.
Expose the functionality through media-react.
Keep React-specific state and lifecycle behavior inside media-react.
Keep presentation logic inside the UI packages.
Keep SDK-owned types as the boundary between data and UI.
Add tests for the new data behavior.
Run typechecking and tests before finishing.
Testing

React data behavior should be tested independently from UI rendering.

When modifying the React data layer, run:

pnpm --filter @fotoowl/media-react typecheck

Then:

pnpm --filter @fotoowl/media-react test

For workspace-wide verification, run:

pnpm typecheck

pnpm test

pnpm build

Tests should cover important behavior such as:

Provider setup
Search behavior
Loading behavior
Error behavior
Pagination
State updates
Integration with the core SDK
Dependency Direction

Keep the dependency direction intact:

apps
├── media-react
│ └── media-core
│
└── media-ui-react

The intended separation is:

media-core
↓
media-react
↓
application

media-ui-react
↑
application

The UI package should remain independent from the data-fetching implementation.

The core SDK should remain independent from React and React Native.

Package Responsibilities
media-core

Responsible for:

Provider integration
API requests
Response mapping
SDK-owned types
Errors
Caching
Request deduplication
Pagination
Events
media-react

Responsible for:

React provider
React hooks
React state management
React lifecycle integration
Exposing core functionality to React applications
media-ui-react

Responsible for:

UI components
UI interactions
Accessibility behavior
Rendering media supplied through props

It should not perform Pexels API requests.

apps/web

Responsible for:

Application composition
Connecting React data hooks to UI components
Application-specific state
Demo behavior
Environment configuration
Decision Rule

When unsure where code belongs, use this rule:

API/provider behavior → media-core

React data/state behavior → media-react

React Native data/state behavior → media-native

UI rendering and interaction → media-ui-react or media-ui-native

Application-specific composition → apps/web

Prefer the smallest layer that owns the responsibility.

Do not move business logic upward into the application when it belongs in the SDK.

Do not move presentation logic downward into the SDK.

Final Verification

Before considering a React data-layer change complete, verify:

pnpm --filter @fotoowl/media-react typecheck

pnpm --filter @fotoowl/media-react test

Then verify the complete workspace:

pnpm typecheck

pnpm test

pnpm build

A change is not complete until the relevant tests and typechecks pass.