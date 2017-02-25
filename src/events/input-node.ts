export interface InputListener<T> {
  (val: T): void;
}


export interface InputNode<T> {
  notify: (val: T) => void;
  listeners: Array<InputListener<T>>;
  children: Array<InputNode<T>>;
}


export function notifyChildren<T>(node: InputNode<T>, val: T): void {
  const len = node.children.length;
  for (let i = 0; i < len; i++) {
    const child = node.children[i];
    child.notify(val);
  }
}


export function notifyListeners<T>(node: InputNode<T>, val: T): void {
  const len = node.listeners.length;
  for (let i = 0; i < len; i++) {
    const listener = node.listeners[i];
    listener(val);
  }
}


export function createInput<T>(): InputNode<T> {
  const node = {
    notify: null,
    listeners: [],
    children: []
  };

  node.notify = function(val: T): void {
    notifyChildren(node, val);
    notifyListeners(node, val);
  };

  return node;
}