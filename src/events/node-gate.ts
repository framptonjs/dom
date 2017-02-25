/**
 *  Only allow an event through if it's target is the given node
 */
export function nodeGate<T>(node: HTMLElement, fn: (evt: Event) => T) {
  return function(evt: Event): T {
    if (evt.target === node) {
      return fn(evt);
    }
  };
}
