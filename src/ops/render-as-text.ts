import { NodeAttributes } from '../types/NodeAttributes';
import {
  Html,
  VNode,
  NodeType
} from '../elements';


const selfClosingTags = [
  'img', 'br', 'input'
];


function reduceObj(fn: (acc: string, key: string, value: any) => string, attrs: Array<Attribute<T>>, initial: string): string {
  for (let key in attrs) {
  }
  return '';
}


function renderAttrs<T>(attrs: Array<Attribute<T>>) {}


function renderChildren<T>(children: Array<Html<T>>): string {
  return '';
}


export function renderAsText<T>(node: Html<T>): string {
  switch (node.type) {
    case NodeType.TEXT:
      return node.text;

    case NodeType.NODE:
      const start: string = `<${node.tag}`;

      const attrs: string =
        reduceObj((acc: string, key: string, value: any): string => {
          acc += ` "${key}"="${value}"`;
          return acc;
        }, node.attrs, '');

      const children: string =
        node.children.reduce((acc: string, child: Html<T>) => {
          acc += renderAsText(child);
          return acc;
        }, '');

      const end: string = `</${node.tag}>`;

      return `${start}${attrs}>${children}${end}`;
  }
}