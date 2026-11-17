import { useSyncExternalStore } from 'react';

/** Keep viewport, orientation and accessibility preferences in sync. */
export default function useMediaQuery(query) {
  return useSyncExternalStore(
    callback => {
      const media = window.matchMedia(query);
      media.addEventListener('change', callback);
      return () => media.removeEventListener('change', callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
