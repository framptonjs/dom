import { Html, NodeType, VKeyedChild, RootNode } from '../elements';
import { AttrType, Attributes, Attribute } from '../attributes';
import { EventDef, EventType } from '../attributes/events';
import { cachedNode } from '../cached-node';


export interface EventFilter<T> {
  (evt: T): boolean;
}


function filterEvent<T>(predicate: EventFilter<T>, eventDef: EventDef<T>): EventDef<T> {
  switch (eventDef.type) {
    case EventType.LIFECYCLE:
      return {
        type: EventType.LIFECYCLE,
        name: eventDef.name,
        handler: function(element: HTMLElement, messages: (val: T) => void): void {
          eventDef.handler(element, function(val: T): void {
            if (predicate(val)) {
              messages(val);
            }
          });
        }
      };

    case EventType.DOM:
      return {
        type: EventType.DOM,
        name: eventDef.name,
        bubbles: eventDef.bubbles,
        handler: function(evt: Event, messages: (val: T) => void): void {
          eventDef.handler(evt, function(val: T): void {
            if (predicate(val)) {
              messages(val);
            }
          });
        }
      };
  }
}


function filterAttr<T>(predicate: EventFilter<T>, attr: Attribute<T>): Attribute<T> {
  switch (attr.type) {
    case AttrType.EVENT:
      return {
        type: AttrType.EVENT,
        value: filterEvent(predicate, attr.value)
      };

    default:
      return attr;
  }
}


function filterAttrs<T>(predicate: EventFilter<T>, attrs: Attributes<T>): Attributes<T> {
  const newAttrs: Attributes<T> = {};
  for (let key in attrs) {
    newAttrs[key] = filterAttr(predicate, attrs[key]);
  }
  return newAttrs;
}


export const filter: <T>(predicate: EventFilter<T>, node: Html<T>) => Html<T> =
  cachedNode(function <T>(predicate: EventFilter<T>, node: Html<T>): Html<T> {
    switch (node.type) {
      case NodeType.NODE:
        return {
          type: NodeType.NODE,
          tag: node.tag,
          attrs: filterAttrs(predicate, node.attrs),
          size: node.size,
          children: node.children.map((child: Html<T>): Html<T> => {
            return filter(predicate, child);
          }),
          domNode: node.domNode
        };

      case NodeType.KEYED_NODE:
        return {
          type: NodeType.KEYED_NODE,
          tag: node.tag,
          attrs: filterAttrs(predicate, node.attrs),
          size: node.size,
          children: node.children.map((child: VKeyedChild<T>): VKeyedChild<T> => {
            return <VKeyedChild<T>>filter(predicate, child);
          }),
          domNode: node.domNode
        };

      case NodeType.KEYED_CHILD:
        return {
          type: NodeType.KEYED_CHILD,
          key: node.key,
          node: <RootNode<T>>filter(predicate, node.node)
        };

      default:
        return node;
    }
  });