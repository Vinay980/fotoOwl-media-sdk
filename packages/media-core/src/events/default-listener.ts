import type {
  MediaEventMap,
  MediaEventName,
} from "../types/events.js";

export function createDefaultEventListener<EventName extends MediaEventName>(
  eventName: EventName,
  event: MediaEventMap[EventName],
): void {
  console.log(`[media-core] ${eventName}`, event);
}