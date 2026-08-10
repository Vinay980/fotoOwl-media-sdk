interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface MemoryCacheOptions {
  ttlMs?: number;
}

export class MemoryCache {
  private readonly entries = new Map<string, CacheEntry<unknown>>();

  private readonly ttlMs: number;

  constructor(options: MemoryCacheOptions = {}) {
    this.ttlMs = options.ttlMs ?? 5 * 60 * 1000;
  }

  get<T>(key: string): T | undefined {
    const entry = this.entries.get(key);

    if (!entry) {
      return undefined;
    }

    if (Date.now() >= entry.expiresAt) {
      this.entries.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T): void {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  delete(key: string): void {
    this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }
}