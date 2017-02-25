import * as StaticKeyed from './keyed';
import * as StaticHtml from './html';
import * as StaticAttributes from './attributes';
import * as StaticEvents from './attributes/events';

export const Keyed = StaticKeyed;
export const Html = StaticHtml;
export const Events = StaticEvents;
export const Attributes = StaticAttributes;
export { scene } from './scene';
export { makeRuntime as Runtime } from './runtime';
export { render } from './ops/render';
export { diff } from './diff';