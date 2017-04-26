import * as StaticKeyed from './src/keyed';
import * as StaticHtml from './src/html';
import * as StaticAttributes from './src/attributes';
import * as StaticEvents from './src/attributes/events';

export const Keyed = StaticKeyed;
export const Html = StaticHtml;
export const Events = StaticEvents;
export const Attributes = StaticAttributes;
export * from './src/elements';
export { scene } from './src/scene';
export { makeRuntime as Runtime } from './src/runtime';
export { render } from './src/ops/render';
export { diff } from './src/diff';
export { AppConfig, app } from './src/app';