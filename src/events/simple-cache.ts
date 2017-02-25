export interface EventHandler {
  (evt: Event): void;
}


export interface SimpleCache<T> {
  (name: string, fn: () => T): T;
}


export interface CacheStore<T> {
  [key: string]: T;
}


export function simpleCache<T>(): SimpleCache<T> {
  const store: CacheStore<T> = {};

  return function(name: string, fn: () => T): T {
    if (store[name] === undefined) {
      store[name] = fn();
    }

    return store[name];
  };
}
