import * as StaticKeyed from './src/keyed';
import * as StaticHtml from './src/html';
import * as StaticAttributes from './src/attributes/attrs';
import * as StaticEvents from './src/attributes/events';
import { innerHTML, value, checked, selected, Property } from './src/attributes/props';

export const Elements = StaticHtml;
export const Keyed = StaticKeyed;
export const Events = StaticEvents;
export const Attrs = StaticAttributes;
export const Props = {
  innerHTML,
  value,
  checked,
  selected
};

export {
  Attribute,
  Attributes,
  Property,
  ClassAttribute,
  EventAttribute,
  DataAttribute,
  StyleAttribute
} from './src/attributes';
export {
  VNode, VKeyedNode, VKeyedChild, EventMap,
  EventNode, NodeKey, RootNode, VText, Html
} from './src/elements';
export { scene, Scheduler } from './src/scene';
export { makeRuntime as Runtime } from './src/runtime';
export { render } from './src/ops/render';
export { diff } from './src/diff';
export { AppConfig, app } from './src/app';
