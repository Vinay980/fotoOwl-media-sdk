export class RequestDeduplicator {
  private readonly inFlight = new Map<string, Promise<unknown>>();

  async execute<T>(
    key: string,
    request: () => Promise<T>,
  ): Promise<T> {
    const existingRequest = this.inFlight.get(key);

    if (existingRequest) {
      return existingRequest as Promise<T>;
    }

    const promise = request();

    this.inFlight.set(key, promise);

    try {
      return await promise;
    } finally {
      this.inFlight.delete(key);
    }
  }

  clear(): void {
    this.inFlight.clear();
  }
}