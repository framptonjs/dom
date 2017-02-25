import { EventAttribute } from '../attributes/events';
import { Runtime } from '../runtime';


export function applyEvent<T>(element: HTMLElement, event: EventAttribute<T>, runtime: Runtime<T>): void {
  if (event.value.handler !== undefined) {
    runtime.addEvent(element, event);
  } else {
    runtime.removeEvent(element, event);
  }
}