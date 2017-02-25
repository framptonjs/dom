import { organizeAttributes, Attributes, Attribute } from './attributes';
import { nodeSize } from './utils/node-size';


export { cachedNode } from './cached-node';


export type EventNode<T> =
  VNode<T> |
  VKeyedNode<T>;


export type RootNode<T> =
  VNode<T> |
  VKeyedNode<T> |
  VText;


export type Html<T> =
  VNode<T> |
  VKeyedNode<T> |
  VKeyedChild<T> |
  VText;


export const enum NodeType {
  TEXT,
  NODE,
  KEYED_NODE,
  KEYED_CHILD
}


export interface VText {
  type: NodeType.TEXT;
  text: string;
  domNode: Text;
}


export interface EventMap {
  [name: string]: (evt: Event) => any;
}


export interface VNode<T> {
  type: NodeType.NODE;
  tag: string;
  attrs: Attributes<T>;
  size: number;
  children: Array<Html<T>>;
  domNode: HTMLElement;
}


export interface VKeyedNode<T> {
  type: NodeType.KEYED_NODE;
  tag: string;
  attrs: Attributes<T>;
  size: number;
  children: Array<VKeyedChild<T>>;
  domNode: HTMLElement;
}


export type NodeKey =
  number | string;


export interface VKeyedChild<T> {
  type: NodeType.KEYED_CHILD;
  key: NodeKey;
  node: RootNode<T>;
}


export function vKeyedNode<T>(tag: string, attrs: Array<Attribute<T>> = [], children: Array<[ NodeKey, RootNode<T> ]> = []): VKeyedNode<T> {
  const len = children.length;
  const processedChildren = [];
  let size = 0;

  for (let i = 0; i < len; i++) {
    const [ key, child ] = children[i];
    const processedChild = vKeyedChild(key, child);
    processedChildren.push(processedChild);
    size += nodeSize(processedChild.node);
  }

  size += processedChildren.length;

  return {
    type: NodeType.KEYED_NODE,
    tag: tag,
    attrs: organizeAttributes(attrs),
    size: size,
    children: processedChildren,
    domNode: undefined
  };
}


export function vKeyedChild<T>(key: NodeKey, node: RootNode<T>): VKeyedChild<T> {
  return {
    type: NodeType.KEYED_CHILD,
    key: key,
    node: node
  };
}


export function vNode<T>(tag: string, attrs: Array<Attribute<T>> = [], children: Array<Html<T>> = []): VNode<T> {
  const len = children.length;
  let size = 0;

  for (let i = 0; i < len; i++) {
    const child = children[i];
    size += nodeSize(child);
  }

  size += children.length;

  return {
    type: NodeType.NODE,
    tag: tag,
    attrs: organizeAttributes(attrs),
    size: size,
    children: children,
    domNode: undefined
  };
}


export function vText(text: string): VText {
  return {
    type: NodeType.TEXT,
    text: text,
    domNode: undefined
  };
}
