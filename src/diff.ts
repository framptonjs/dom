import {
  VNode,
  VKeyedNode,
  VKeyedChild,
  VText,
  Html,
  NodeType,
  RootNode
} from './elements';
import {
  replacePatch,
  reorderPatch,
  propsPatch,
  textPatch,
  appendPatch,
  removePatch,
  Patch,
  ReorderDiff
} from './patches';
import { diffProps } from './utils/diff-props';


export function diff<T>(oldNode: RootNode<T>, newNode: RootNode<T>): Array<Patch> {
  const patches: Array<Patch> = [];
  runDiff(oldNode, newNode, patches);
  return patches;
}


function runDiff<T>(oldNode: Html<T>, newNode: Html<T>, patches: Array<Patch>): void {
  // If old and new are same reference assume no changes
  if (oldNode === newNode) {
    return;
  }

  // Node types are different, much has changed, redraw it all.
  if (oldNode.type !== newNode.type) {
    patches.push(replacePatch(newNode, (<RootNode<T>>oldNode).domNode));
    return;
  }

  // We know nodes have the same type.
  switch (oldNode.type) {
    case NodeType.TEXT: {
      (<VText>newNode).domNode = oldNode.domNode;
      if ((<VText>newNode).text !== oldNode.text) {
        patches.push(textPatch((<VText>newNode).text, oldNode.domNode));
      }
      return;
    }

    case NodeType.KEYED_CHILD: {
      return runDiff(oldNode.node, (<VKeyedChild<T>>newNode).node, patches);
    }

    case NodeType.KEYED_NODE: {
      (<VKeyedNode<T>>newNode).domNode = oldNode.domNode;

      if ((<VKeyedNode<T>>newNode).tag !== oldNode.tag) {
        patches.push(replacePatch(newNode, oldNode.domNode));
        return;
      }

      let propsDiff = diffProps(oldNode.attrs, (<VKeyedNode<T>>newNode).attrs);

      if (propsDiff !== null) {
        patches.push(propsPatch(propsDiff, oldNode.domNode));
      }

      diffKeyedChildren(oldNode, (<VKeyedNode<T>>newNode), patches);

      return;
    }

    case NodeType.NODE: {
      (<VNode<T>>newNode).domNode = oldNode.domNode;

      if ((<VNode<T>>newNode).tag !== oldNode.tag) {
        patches.push(replacePatch(newNode, oldNode.domNode));
        return;
      }

      let propsDiff = diffProps(oldNode.attrs, (<VNode<T>>newNode).attrs);

      if (propsDiff !== null) {
        patches.push(propsPatch(propsDiff, oldNode.domNode));
      }

      diffChildren(oldNode, (<VNode<T>>newNode), patches);
      return;
    }

    default:
      throw new Error(`Unknown node type: ${oldNode}`);
  }
}


function diffChildren<T>(oldParent: VNode<T>, newParent: VNode<T>, patches: Array<Patch>): void {
  const oldChildren: Array<Html<T>> = oldParent.children;
  const newChildren: Array<Html<T>> = newParent.children;
  const oldLen = oldChildren.length;
  const newLen = newChildren.length;
  const len = (oldLen > newLen) ? oldLen : newLen;

  for (let i = 0; i < len; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    // APPEND NEW
    if (oldChild === undefined) {
      patches.push(appendPatch(newChild, oldParent.domNode));

    // REMOVE OLD
    } else if (newChild === undefined) {
      patches.push(removePatch(oldChild, (<any>oldChild).domNode));

    // DIFF THE REST
    } else {
      runDiff(oldChild, newChild, patches);
    }
  }
}


interface KeyMap {
  [name: number]: number;
}


/**
 * Running a diff between two nodes we can assume have not moved is relatively easy. Diffing between two nodes that
 * may have moved is a bit more tricky. We perform this task in three loops (non-nested) giving us a linear-time
 * diff.
 *
 * The first two loops build maps so that we can reference old indexes of new nodes and new indexes of old nodes.
 * We map node keys to indexes. We then check to see if these (key->index) have moved or been removed.
 */
function diffKeyedChildren<T>(oldParent: VKeyedNode<T>, newParent: VKeyedNode<T>, patches: Array<Patch>): void {
  const oldChildren: Array<VKeyedChild<T>> = oldParent.children;
  const newChildren: Array<VKeyedChild<T>> = newParent.children;
  const oldLen = oldChildren.length;
  const newLen = newChildren.length;
  const maxLen = (oldLen > newLen) ? oldLen : newLen;
  const oldKeys: KeyMap = {};
  const newKeys: KeyMap = {};
  let isDirty: boolean = false;
  let diff: ReorderDiff<T> = {
    inserts: [],
    deletes: [],
    moves: []
  };

  // Create a map of keys to their new index O(n)
  for (let i = 0; i < newLen; i++) {
    const child = newChildren[i];
    const key = child.key;
    newKeys[key] = i;
  }

  // Create a map of keys to their old index O(n)
  for (let i = 0; i < oldLen; i++) {
    const child = oldChildren[i];
    const key = child.key;
    oldKeys[key] = i;
  }

  /**
   * {
   *   inserts: [],
   *   deletes: [],
   *   moves: []
   * }
   *
   * 1. Keys match -> diff nodes
   * 2. Old key is undefined remove node
   * 3. New key is undefined add node
   * 4. Match nodes and diff
   *
   * The newChild is our source of truth. What has passed is prologue. We will look forward or back
   * to find moves, but the current index will always reference the new node.
   *
   */
  for (let i = 0; i < maxLen; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];
    const newIndex = (oldChild !== undefined) ? newKeys[oldChild.key] : undefined;
    const oldIndex = (newChild !== undefined) ? oldKeys[newChild.key] : undefined;

    // Keys and indexes match, just run a diff
    if (oldChild !== undefined && newChild !== undefined && newChild.key === oldChild.key) {
      runDiff(oldChild, newChild, patches);

    // Indexes don't match. We have a move.
    } else if (oldIndex !== undefined) {
      isDirty = true;
      diff.moves.push({
        node: newChild,
        oldIndex: oldIndex,
        newIndex: i
      });

      runDiff(oldChildren[oldIndex], newChild, patches);
    }

    // No new index. Delete old node.
    if (newIndex === undefined && oldChild !== undefined) {
      isDirty = true;
      diff.deletes.push({
        node: oldChild
      });
    }

    // No old index. Insert new node.
    if (oldIndex === undefined && newChild !== undefined) {
      isDirty = true;
      diff.inserts.push({
        node: newChild,
        index: i
      });
    }
  }

  // Ewww, dirty, we need to fix things.
  if (isDirty === true) {
    patches.push(reorderPatch(diff, oldParent.domNode));
  }
}
