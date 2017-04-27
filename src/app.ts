import { Signal, Effect, Task } from '@frampton/core';
import { RootNode } from './elements';
import { scene, Scheduler } from './scene';

export type StateAndEffect<S,M> =
  [ S, Effect<M> ];


export interface AppConfig<S,M> {
  update(msg: M, state: S): StateAndEffect<S,M>;
  view(state: S): RootNode<M>;
  init(): StateAndEffect<S,M>;
  inputs: Array<Signal<M>>;
  rootElement: Element;
}


export function app<S,M>(config: AppConfig<S,M>): Signal<S> {

  function update(acc: StateAndEffect<S,M>, next: M) {
    const model: S = acc[0];
    return config.update(next, model);
  }

  const messages: Signal<M> =
    Signal.create<M>();

  const initialState: StateAndEffect<S,M> =
    config.init();

  const inputs: Array<Signal<M>> =
    (config.inputs || []);

  const allInputs: Signal<M> =
    Signal.merge<M>(messages, ...inputs);

  const stateAndTasks: Signal<StateAndEffect<S,M>> =
    allInputs.fold(update, initialState);

  const state: Signal<S> =
    stateAndTasks.map((next: StateAndEffect<S,M>) => {
      return next[0];
    });

  const initialView: RootNode<M> =
    config.view(initialState[0]);

  const schedule: Scheduler<M> =
    scene(config.rootElement, initialView, Signal.push(messages));

  const html = state.map((next) => {
    return config.view(next);
  });

  const tasks: Signal<Effect<M>> =
    stateAndTasks.map((next: StateAndEffect<S,M>) => {
      return next[1];
    });

  // Run tasks and publish any resulting events back into messages
  Task.execute(tasks, Signal.push(messages));

  // Render state updates
  html.onValue((tree: RootNode<M>) => {
    schedule(tree);
  });

  return state;
};
