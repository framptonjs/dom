import { Html } from './elements';
import requestFrame from './utils/request-frame';
import { render } from './ops/render';
import { diff } from './diff';
import { applyPatches } from './ops/apply-patches';
import { Runtime, makeRuntime } from './runtime';


const enum RenderState {
  NOTHING,
  PENDING
}


export interface Scheduler<T> {
  (dom: Html<T>): void;
}


export interface MessageSink<T> {
  (evt: T): void;
}


export function scene<T>(rootNode: Element, initialView: Html<T>, messages: MessageSink<T>): Scheduler<T> {
  const runtime: Runtime<T> =
    makeRuntime(messages);

  let savedDOM: Html<T> =
    initialView;

  let scheduledDOM: Html<T> =
    null;

  let state: RenderState =
    RenderState.NOTHING;

  rootNode.appendChild(render(savedDOM, runtime));
  runtime.sceneRendered();

  function draw() {
    const patches = diff(savedDOM, scheduledDOM);
    applyPatches(patches, runtime);
    runtime.sceneRendered();

    savedDOM = scheduledDOM;
    state = RenderState.NOTHING;
  }

  return function scheduler(dom: Html<T>): void {
    scheduledDOM = dom;

    switch (state) {
      case RenderState.NOTHING:
        requestFrame(draw);
        state = RenderState.PENDING;
        break;

      default:
        state = RenderState.PENDING;
        break;
    }
  };
}
