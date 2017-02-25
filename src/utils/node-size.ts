import { NodeType, Html } from '../elements';

export function nodeSize<T>(node: Html<T>): number {
  switch (node.type) {
    case NodeType.NODE:
    case NodeType.KEYED_NODE:
      return node.size;

    case NodeType.KEYED_CHILD:
      return nodeSize(node.node);

    default:
      return 0;
  }
}