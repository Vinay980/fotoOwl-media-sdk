# FotoOwl Media UI Components Skill

## Purpose

Use this skill when building, composing, styling, or customizing the reusable
React UI components provided by `@fotoowl/media-ui-react`.

The UI package is intentionally presentation-focused.

Application code owns:

- API/data fetching
- search state
- selected media state
- active video state
- business logic
- SDK configuration

The UI package owns:

- rendering media
- user interaction
- presentation callbacks
- accessibility behavior
- reusable component composition

---

# 1. Public Components

The package exports:

```tsx
import {
  MediaCard,
  MediaGrid,
  MediaSearch,
  MediaLightbox,
  MediaReel,
} from "@fotoowl/media-ui-react";

It also exports:

import type {
  MediaCardProps,
  MediaGridProps,
  MediaSearchProps,
  MediaLightboxProps,
  MediaReelProps,
  MediaItem,
} from "@fotoowl/media-ui-react";

Do not import internal component files from application code.

Prefer the package entry point:

import {
  MediaGrid,
  MediaCard,
} from "@fotoowl/media-ui-react";
2. Architecture Rule

The UI package must remain independent of the data layer.

Correct:

Application
    │
    ├── useMediaSearch()
    │
    └── media-ui-react
            │
            ├── MediaSearch
            ├── MediaGrid
            ├── MediaCard
            ├── MediaReel
            └── MediaLightbox

Incorrect:

MediaGrid
    ↓
useMediaSearch()

Incorrect:

import {
  useMediaSearch,
} from "@fotoowl/media-react";

inside media-ui-react.

UI components receive data and callbacks through props.

They must not fetch media themselves.

3. MediaCard

MediaCard renders one MediaItem.

Props
interface MediaCardProps {
  media: MediaItem;
  onSelect?: (media: MediaItem) => void;
  className?: string;
  imageClassName?: string;
  videoBadgeClassName?: string;
  photographerClassName?: string;
  children?: ReactNode;
}
Basic usage
<MediaCard
  media={media}
/>

The default rendering includes:

media image
video badge when the item is a video
photographer name when available
4. MediaCard selection

Use onSelect when the application needs to respond to a selected media item.

<MediaCard
  media={media}
  onSelect={(selectedMedia) => {
    setSelectedMedia(selectedMedia);
  }}
/>

When onSelect exists, the card becomes keyboard interactive.

Supported keys:

Enter
Space

The callback receives the same MediaItem supplied through media.

Do not create separate selection state inside MediaCard.

5. MediaCard accessibility

When onSelect is provided, MediaCard:

becomes keyboard focusable
responds to Enter
responds to Space

Do not remove these behaviors when customizing the component.

If replacing the entire component with children, preserve equivalent
keyboard and interaction behavior when the custom UI remains selectable.

6. MediaCard styling

MediaCard supports:

className
imageClassName
videoBadgeClassName
photographerClassName

Example:

<MediaCard
  media={media}
  className="media-card"
  imageClassName="media-card-image"
  videoBadgeClassName="media-card-video-badge"
  photographerClassName="media-card-photographer"
/>

The application controls the CSS.

The component does not require a specific styling framework.

Do not hard-code application-specific layout CSS inside the reusable component.

7. MediaCard custom rendering

children can replace the default card content.

Example:

<MediaCard
  media={media}
  onSelect={setSelectedMedia}
  className="media-card"
>
  <img
    src={media.thumbnailUrl ?? media.url}
    alt="Custom media"
  />

  <strong>
    Custom presentation
  </strong>
</MediaCard>

When children is provided, the default:

image
video badge
photographer

content is not rendered.

Use this when the application needs a different visual presentation while
retaining the reusable card interaction.

8. MediaGrid

MediaGrid renders a collection of media items.

Props
interface MediaGridProps {
  items: MediaItem[];
  onSelect?: (media: MediaItem) => void;
  columns?: number;
  className?: string;
  itemClassName?: string;
  children?: ReactNode;
  hasNextPage?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}
9. Basic MediaGrid usage
<MediaGrid
  items={data.items}
/>

Selection:

<MediaGrid
  items={data.items}
  onSelect={setSelectedMedia}
/>

Styling:

<MediaGrid
  items={data.items}
  className="media-grid"
  itemClassName="media-card"
/>
10. MediaGrid pagination

MediaGrid can expose an infinite-scroll loading boundary.

Use:

<MediaGrid
  items={data.items}
  hasNextPage={hasNextPage}
  loadingMore={loadingMore}
  onLoadMore={() => {
    void loadMore();
  }}
/>

The responsibilities are separated:

useMediaSearch
    ↓
knows whether another page exists
    ↓
Application
    ↓
passes hasNextPage/loadingMore/onLoadMore
    ↓
MediaGrid
    ↓
detects when the loading boundary enters the viewport
    ↓
calls onLoadMore()

MediaGrid does not know how the next page is fetched.

11. MediaGrid loading behavior

When:

loadingMore === true

the grid displays its loading boundary.

The component must not call onLoadMore while another load is active.

Do not implement another pagination state machine inside the grid.

The application remains responsible for supplying the correct loading state.

12. MediaGrid custom content

children can replace the default item rendering.

Example:

<MediaGrid items={data.items}>
  <CustomMediaLayout />
</MediaGrid>

When children is supplied, the default items.map(...) rendering is replaced.

Use this when the application needs full control over the grid content.

If custom children are used, the application is responsible for rendering the
desired media items.

13. MediaSearch

MediaSearch is a reusable search form.

Props
interface MediaSearchProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}
14. MediaSearch basic usage
<MediaSearch
  onSearch={handleSearch}
/>

With an initial query:

<MediaSearch
  initialQuery={query}
  onSearch={handleSearch}
/>

With loading:

<MediaSearch
  initialQuery={query}
  onSearch={handleSearch}
  loading={loading}
/>
15. MediaSearch behavior

The component:

stores the input value locally
trims the query
prevents submission for an empty query
prevents submission while loading
calls onSearch() with the trimmed query

Example:

"   nature   "
        ↓
"nature"
        ↓
onSearch("nature")

The component should not perform network requests.

16. MediaSearch styling

Use:

<MediaSearch
  className="search-form"
  inputClassName="search-input"
  buttonClassName="search-button"
/>

Example:

.search-form {
  display: flex;
  gap: 12px;
}

.search-input {
  flex: 1;
}

.search-button {
  cursor: pointer;
}

Do not place application-specific CSS inside MediaSearch.tsx.

17. MediaLightbox

MediaLightbox displays one selected media item.

Props
interface MediaLightboxProps {
  media: MediaItem | null;
  onClose: () => void;
  className?: string;
  children?: ReactNode;
}

When:

media === null

the component renders nothing.

18. MediaLightbox usage

Application owns the selected media:

const [
  selectedMedia,
  setSelectedMedia,
] = useState<MediaItem | null>(
  null,
);

Connect the grid:

<MediaGrid
  items={data.items}
  onSelect={setSelectedMedia}
/>

Connect the lightbox:

<MediaLightbox
  media={selectedMedia}
  onClose={() => {
    setSelectedMedia(null);
  }}
/>

This is the preferred composition.

19. MediaLightbox behavior

The lightbox:

renders as a dialog
uses aria-modal="true"
provides a close button
closes when the outer dialog area is clicked
prevents content clicks from closing the lightbox
renders video when videoUrl is available
otherwise renders an image

Do not move selected-media state into MediaLightbox.

20. MediaLightbox custom rendering

Use children to replace the default media presentation.

Example:

<MediaLightbox
  media={selectedMedia}
  onClose={() => {
    setSelectedMedia(null);
  }}
>
  <CustomViewer media={selectedMedia} />
</MediaLightbox>

Custom content is responsible for its own presentation.

The lightbox remains responsible for:

dialog behavior
closing
interaction boundary
21. MediaReel

MediaReel renders media as a scrollable/reel-style collection.

Props
interface MediaReelProps {
  items: MediaItem[];
  activeIndex?: number;
  onActiveChange?: (
    index: number,
    media: MediaItem,
  ) => void;
  className?: string;
  itemClassName?: string;
  children?: (
    media: MediaItem,
    index: number,
  ) => ReactNode;
}
22. MediaReel basic usage
<MediaReel
  items={data.items}
/>

For active-item tracking:

const [
  activeVideoIndex,
  setActiveVideoIndex,
] = useState(0);

<MediaReel
  items={data.items}
  activeIndex={activeVideoIndex}
  onActiveChange={(index) => {
    setActiveVideoIndex(index);
  }}
/>
23. MediaReel active item behavior

MediaReel uses IntersectionObserver to determine which item is visible.

An item is considered active when it reaches the component's visibility
threshold.

When an item becomes active:

onActiveChange(index, media)

is called.

The application may use this to update:

activeIndex

or trigger application-level behavior.

Do not duplicate the intersection-observer logic in the application.

24. MediaReel video behavior

For a media item with:

media.type === "video"

and:

media.videoUrl

the default rendering uses:

<video
  src={media.videoUrl}
  controls
  muted={index !== activeIndex}
  autoPlay={index === activeIndex}
/>

The active item is therefore:

autoplayed
unmuted

while inactive videos are muted.

Do not add a second competing autoplay mechanism in the application.

25. MediaReel custom rendering

children is a render function:

<MediaReel
  items={data.items}
>
  {(media, index) => (
    <CustomMedia
      media={media}
      index={index}
    />
  )}
</MediaReel>

The callback receives:

media
index

Use this when the default image/video rendering is insufficient.

26. Component composition

A common photo application should use:

MediaSearch
      ↓
useMediaSearch
      ↓
MediaGrid
      ↓
MediaCard
      ↓
MediaLightbox

Example:

<MediaSearch
  initialQuery={query}
  loading={loading}
  onSearch={setQuery}
/>

<MediaGrid
  items={data?.items ?? []}
  hasNextPage={hasNextPage}
  loadingMore={loadingMore}
  onLoadMore={() => {
    void loadMore();
  }}
  onSelect={setSelectedMedia}
/>

<MediaLightbox
  media={selectedMedia}
  onClose={() => {
    setSelectedMedia(null);
  }}
/>

A video experience can use:

MediaSearch
      ↓
useMediaSearch(type="video")
      ↓
MediaReel
27. Styling strategy

The UI package is intentionally headless regarding visual styling.

Use the provided class-name props.

For example:

<MediaGrid
  className="media-grid"
  itemClassName="media-card"
/>

and:

<MediaSearch
  className="search-form"
  inputClassName="search-input"
  buttonClassName="search-button"
/>

Do not assume:

Tailwind
CSS Modules
styled-components
Material UI
Bootstrap

The consuming application chooses its styling system.

28. Do not confuse SDK logic with UI logic

Do not put this inside UI components:

fetch(...)

Do not put this inside UI components:

createMediaClient(...)

Do not put this inside UI components:

useMediaSearch(...)

Do not import:

@fotoowl/media-react

from media-ui-react.

UI components should receive data through props.

29. Accessibility rules

When modifying these components, preserve existing accessibility behavior.

Important behaviors include:

MediaCard
keyboard activation
meaningful image alt text
MediaSearch
labeled input
native form submission
disabled submit while loading/empty
MediaLightbox
role="dialog"
aria-modal="true"
close button
media accessibility labels
MediaReel
meaningful video labels
meaningful image alt text

Do not remove accessibility attributes simply to simplify markup.

30. AI customization rules

When an AI agent is asked to customize a component:

First determine whether the change belongs in:
application CSS
component props
component implementation

Prefer this order:

existing className prop
        ↓
application CSS
        ↓
children/custom rendering
        ↓
component implementation

Do not modify reusable component internals merely to change application-specific
visual styling.

31. Preserve public APIs

Do not remove or rename existing props without a strong architectural reason.

Before modifying a component, check its current public interface.

For example, do not replace:

itemClassName

with:

className

if the application already depends on the distinction.

Likewise, do not remove:

hasNextPage
loadingMore
onLoadMore

from MediaGrid if pagination is part of the current public API.

32. Testing expectations

Every behavioral change to a reusable UI component should have a corresponding
test.

Important behaviors include:

MediaCard
renders media information
invokes onSelect
keyboard selection
MediaGrid
renders all items
invokes onLoadMore
handles loading state
MediaSearch
trims search queries
submits valid queries
prevents invalid/loading submissions
MediaLightbox
renders selected media
closes correctly
MediaReel
renders items
reports active media
handles empty lists

Run:

pnpm --filter @fotoowl/media-ui-react typecheck

and:

pnpm --filter @fotoowl/media-ui-react test

before considering the change complete.

33. AI implementation checklist

Before finishing a UI implementation, verify:

 No API calls were added to UI components.
 No media-react dependency was added to media-ui-react.
 No media-core dependency was added to media-ui-react.
 Existing public props were preserved.
 className customization remains possible.
 Custom rendering uses children where appropriate.
 Selection remains controlled by the application.
 Pagination remains controlled by the application/SDK.
 Loading state is supplied by the application.
 Accessibility behavior is preserved.
 Keyboard behavior is preserved.
 Media alt text remains meaningful.
 Video behavior remains correct.
 Component-specific tests were updated.
 TypeScript passes.
 Component tests pass.
Core rule

media-ui-react renders and exposes interaction; the application owns state and
the data layer owns fetching.

Never solve an application data problem by adding data-fetching logic to a
reusable UI component.


This version is now based directly on the current source you supplied, including the newer `MediaGrid` pagination API and the headless/customization props. :contentReference[oaicite:1]{index=1}

### One thing I would change later

Your current `MediaGrid` has:

```tsx
columns?: number;

but doesn't actually use columns.

That's a public API smell. For the assignment, I'd either:

implement columns properly, or
remove it from the public API if you're intentionally making layout completely application-controlled.
