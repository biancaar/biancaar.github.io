export function safeDispose(disposables) {
  for (const d of disposables) {
    try {
      d?.dispose?.();
    } catch {
      // Intentional: disposal should never crash the app.
    }
  }
}
