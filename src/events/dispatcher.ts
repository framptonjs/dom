import { getDocumentEvent } from './get-document-event';
import { InputNode, InputListener } from './input-node';
import { DomEventDef } from '../attributes/events';


interface EventHandler {
  (evt: Event): void;
}


interface ElementEventMap {
  [name: string]: EventDescription;
}


interface EventDescription {
  name: string;
  bubbles: boolean;
  handler: EventHandler
}


function removeFromDocument(name: string, bubbles: boolean, handler: EventHandler): void {
  const documentInput: InputNode<Event> =
    getDocumentEvent(name, bubbles);

  if (handler !== undefined) {
    const listeners: Array<InputListener<Event>> =
      documentInput.listeners;

    const updatedListeners: Array<InputListener<Event>> =
      [];

    const len: number =
      listeners.length;

    for (let i = 0; i < len; i++) {
      if (listeners[i] !== handler) {
        updatedListeners.push(listeners[i]);
      }
    }

    documentInput.listeners = updatedListeners;
  }
}


export function removeEvent<T>(element: HTMLElement, event: DomEventDef<T>): void {
  const name: string =
    event.name;

  const handlers: ElementEventMap =
    (<any>element).__fr_event_handlers;

  if (handlers[name] !== undefined) {
    const eventDescription: EventDescription =
      handlers[name];

    const handler: EventHandler =
      eventDescription.handler;

    const bubbles: boolean =
      eventDescription.bubbles;

    removeFromDocument(name, bubbles, handler);
  }
}


export function removeAllEvents(node: Node): void {
  const handlers: ElementEventMap =
    (<any>node).__fr_event_handlers;

  if (handlers !== undefined) {
    for (let key in handlers) {
      const event: EventDescription =
        handlers[key];

      if (event !== undefined) {
        removeFromDocument(event.name, event.bubbles, event.handler);
      }
    }
  }
}


export function addEvent<T>(element: HTMLElement, event: DomEventDef<T>, callback: (evt: Event) => void): void {
  if ((<any>element).__fr_event_handlers === undefined) {
    (<any>element).__fr_event_handlers = {};
  }

  const name: string =
    event.name;

  const bubbles: boolean =
    event.bubbles;

  const documentInput: InputNode<Event> =
    getDocumentEvent(name, bubbles);

  (<any>element).__fr_event_handlers[name] = {
    name: name,
    bubbles: bubbles,
    handler: callback
  };

  documentInput.listeners.push(callback);
}