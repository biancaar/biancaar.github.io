/**
 * Adds a cross-browser media query "change" listener and returns cleanup.
 */
export const subscribeMediaQueryChange = (mediaQuery, listener) => {
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }

  mediaQuery.addListener(listener);
  return () => mediaQuery.removeListener(listener);
};
