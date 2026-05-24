import { useSyncExternalStore } from 'react';

export function create<T extends object>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();

  const get = () => state;
  const set = (partial: Partial<T>) => {
    state = { ...state, ...partial };
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const useStore = () => useSyncExternalStore(subscribe, get, get);

  return { get, set, subscribe, useStore };
}
