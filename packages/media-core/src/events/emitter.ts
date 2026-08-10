import type {
  MediaEventListener,
  MediaEventMap,
  MediaEventName,
} from "../types/events.js";

export class EventEmitter {
  private readonly listeners = new Map<
    MediaEventName,
    Set<MediaEventListener<MediaEventName>>
  >();

  on<EventName extends MediaEventName>(
    event: EventName,
    listener: MediaEventListener<EventName>,
  ): () => void {
    const listeners = this.listeners.get(event) ?? new Set();

    listeners.add(
      listener as MediaEventListener<MediaEventName>,
    );

    this.listeners.set(event, listeners);

    return () => {
      listeners.delete(
        listener as MediaEventListener<MediaEventName>,
      );

      if (listeners.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  emit<EventName extends MediaEventName>(
    event: EventName,
    payload: MediaEventMap[EventName],
  ): void {
    const listeners = this.listeners.get(event);

    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      listener(payload);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}