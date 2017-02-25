import * as EventDispatcher from './events/dispatcher';
import { InputNode } from './events/input-node';
import { EventAttribute, EventType, DomEventDef, LifecycleEventDef } from './attributes/events';


export interface Runtime<T> {
  addEvent(element: HTMLElement, eventDef: EventAttribute<T>): void;
  removeEvent(element: HTMLElement, eventDef: EventAttribute<T>): void;
  removeAllEvents(node: Node): void;
  push(input: InputNode<T>, value: T): void;
  sceneRendered(): void;
}


interface EventSink {
  (evt: Event): void;
}


interface LifecycleEventSink {
  (element: HTMLElement): void;
}


interface LifecycleNode {
  element: HTMLElement;
  handler: LifecycleEventSink;
}


function contains(child: HTMLElement, parent: HTMLElement): boolean {
  return (
    child === parent ||
    parent.contains(child)
  );
}


function nodeGate(element: HTMLElement, handler: EventSink): EventSink {
  return function(evt: Event): void {
    const target = <HTMLElement>evt.target;
    if (target && contains(target, element)) {
      handler(evt);
    }
  };
}


function makeHandler<T>(element: HTMLElement, event: DomEventDef<T>, messages: (evt: T) => void): EventSink {
  return nodeGate(element, function (evt: Event): void {
    event.handler(evt, messages);
  });
}


function makeLifecycleHandler<T>(event: LifecycleEventDef<T>, messages: (evt: T) => void): LifecycleEventSink {
  return function lifecycleHandler(element: HTMLElement): void {
    event.handler(element, messages);
  };
}


function removeAllEvents(node: Node): void {
  const len = node.childNodes.length;
  for (let i = 0; i < len; i++) {
    const childNode: Node = node.childNodes[i];
    EventDispatcher.removeAllEvents(childNode);
    removeAllEvents(childNode);
  }
}


export function makeRuntime<T>(messages: (evt: T) => void): Runtime<T> {
  const inputs = [];
  let lifecycleNodes: Array<LifecycleNode> = [];

  return {
    addEvent(element: HTMLElement, event: EventAttribute<T>): void {
      switch (event.value.type) {
        case EventType.DOM: {
          const eventHandler: EventSink = makeHandler<T>(element, event.value, messages);
          EventDispatcher.addEvent(element, event.value, eventHandler);
          break;
        }

        case EventType.LIFECYCLE: {
          lifecycleNodes.push({
            element: element,
            handler: makeLifecycleHandler<T>(event.value, messages)
          });
          break;
        }
      }

    },

    removeEvent(element: HTMLElement, event: EventAttribute<T>): void {
      switch (event.value.type) {
        case EventType.DOM: {
          EventDispatcher.removeEvent(element, event.value);
          break;
        }

        case EventType.LIFECYCLE: {
          const len: number =
            lifecycleNodes.length;

          const newLifecycleNodes: Array<LifecycleNode> =
            [];

          for (let i = 0; i < len; i++) {
            if (lifecycleNodes[i].element !== element) {
              newLifecycleNodes.push(lifecycleNodes[i]);
            }
          }

          lifecycleNodes = newLifecycleNodes;
          break;
        }
      }

    },

    removeAllEvents(node: Node): void {
      setTimeout(() => {
        removeAllEvents(node);
      }, 0);
    },

    sceneRendered(): void {
      let node = lifecycleNodes.pop();
      while (node) {
        node.handler(node.element);
        node = lifecycleNodes.pop();
      }
    },

    push<T>(input: InputNode<T>, value: T): void {
      inputs.push(input);
    }
  };
};