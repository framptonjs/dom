import { Html, NodeType, VKeyedChild, RootNode } from '../elements';
import { AttrType, Attributes, Attribute } from '../attributes';
import { EventDef, EventType } from '../attributes/events';
import { cachedNode } from '../cached-node';


export interface EventMapping<A,B> {
  (evt: A): B;
}


function mapEvent<A,B>(fn: EventMapping<A,B>, eventDef: EventDef<A>): EventDef<B> {
  switch (eventDef.type) {
    case EventType.LIFECYCLE:
      return {
        type: EventType.LIFECYCLE,
        name: eventDef.name,
        handler: function(element: HTMLElement, messages: (val: B) => void): void {
          eventDef.handler(element, function(val: A): void {
            messages(fn(val));
          });
        }
      };

    case EventType.DOM:
      return {
        type: EventType.DOM,
        name: eventDef.name,
        bubbles: eventDef.bubbles,
        handler: function(evt: Event, messages: (val: B) => void): void {
          eventDef.handler(evt, function(val: A): void {
            messages(fn(val));
          });
        }
      };
  }
}


function mapAttr<A,B>(fn: EventMapping<A,B>, attr: Attribute<A>): Attribute<B> {
  switch (attr.type) {
    case AttrType.EVENT:
      return {
        type: AttrType.EVENT,
        value: mapEvent(fn, attr.value)
      };

    default:
      return attr;
  }
}


function mapAttrs<A,B>(fn: EventMapping<A,B>, attrs: Attributes<A>): Attributes<B> {
  const newAttrs: Attributes<B> = {};
  for (let key in attrs) {
    newAttrs[key] = mapAttr(fn, attrs[key]);
  }
  return newAttrs;
}


export const map: <A,B>(fn: EventMapping<A,B>, node: Html<A>) => Html<B> =
  cachedNode(function <A,B>(fn: EventMapping<A,B>, node: Html<A>): Html<B> {
    switch (node.type) {
      case NodeType.NODE:
        return {
          type: NodeType.NODE,
          tag: node.tag,
          attrs: mapAttrs(fn, node.attrs),
          size: node.size,
          children: node.children.map((child: Html<A>): Html<B> => {
            return map(fn, child);
          }),
          domNode: node.domNode
        };

      case NodeType.KEYED_NODE:
        return {
          type: NodeType.KEYED_NODE,
          tag: node.tag,
          attrs: mapAttrs(fn, node.attrs),
          size: node.size,
          children: node.children.map((child: VKeyedChild<A>): VKeyedChild<B> => {
            return <VKeyedChild<B>>map(fn, child);
          }),
          domNode: node.domNode
        };

      case NodeType.KEYED_CHILD:
        return {
          type: NodeType.KEYED_CHILD,
          key: node.key,
          node: <RootNode<B>>map(fn, node.node)
        };

      default:
        return node;
    }
  });