import { addDomEvent } from './add-dom-event';
import { createInput, InputNode } from './input-node';


function notifyListeners<T>(input: InputNode<T>, evt: T): void {
  const len: number = input.listeners.length;
  for (let i = 0; i < len; i++) {
    const listener = input.listeners[i];
    listener(evt);
  }
}


function notifyChildren<T>(input: InputNode<T>, evt: T): void {
  const len: number = input.children.length;
  for (let i = 0; i < len; i++) {
    const child = input.children[i];
    notifyListeners(child, evt);
    notifyChildren(child, evt);
  }
}


export function getEventInput(name: string, bubbles: boolean, target: HTMLElement): InputNode<Event> {
  const input: InputNode<Event> = createInput();
  addDomEvent(target, name, bubbles, function(evt) {
    notifyChildren(input, evt);
    notifyListeners(input, evt);
  });

  return input;
}