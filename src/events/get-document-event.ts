import { simpleCache, SimpleCache } from './simple-cache';
import { getEventInput } from './get-event-input';
import { InputNode } from './input-node';


const documentCache: SimpleCache<InputNode<Event>> =
  simpleCache<InputNode<Event>>();


export function getDocumentEvent(name: string, bubbles: boolean): InputNode<Event> {
  return documentCache(name, () => {
    return getEventInput(name, bubbles, document.documentElement);
  });
}