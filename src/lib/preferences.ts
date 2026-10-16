import { useCallback, useSyncExternalStore } from 'react';
const queries = new Map<string, MediaQueryList>();
function media(query: string) {
  if (typeof window === 'undefined') return null;
  let value = queries.get(query);
  if (!value) {
    value = window.matchMedia(query);
    queries.set(query, value);
  }
  return value;
}
const serverSnapshot = () => false;
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const value = media(query);
      value?.addEventListener('change', notify);
      return () => value?.removeEventListener('change', notify);
    },
    [query],
  );
  const snapshot = useCallback(() => media(query)?.matches ?? false, [query]);
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
