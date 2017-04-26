import { Signal, Task, Effect } from '@frampton/core';
import { app } from '../src/app';
import { div, text } from '../src/html';
import { onClick } from '../src/attributes/events';
import { assert } from 'chai';


interface MockState {
  count: number;
}


describe('app', function() {
  var container: Element = null;
  var rootElement: Element = null;

  beforeEach(function() {
    container = document.body;
    rootElement = document.createElement('div');
    container.appendChild(rootElement);
  });

  afterEach(function() {
    container.removeChild(rootElement);
    rootElement = null;
    container = null;
  });

  const clickHandler =
    (evt: Event): string => 'click happened';

  const initState =
    (count: number): MockState => ({
      count : count
    });

  it('should create a functioning app', function(done) {
    const inputs: Signal<string> =
      Signal.create<string>();

    var count: number =
      0;

    function init(): [ MockState, Effect<string> ] {
      return [ initState(0), Task.never() ];
    }

    function update(msg: string, state: MockState): [ MockState, Effect<string> ] {
      assert.equal(msg, 'first', 'Message incorrect');
      assert.equal(state.count, 0, 'Initial state incorrect');

      switch(msg) {
        case 'first':
          count ++;
          const newState = initState(state.count + 1);
          return [ newState, Task.never() ];

        default:
          return [ state, Task.never() ];
      }
    }

    function view(state: MockState) {
      assert.equal(state.count, count);
      if (state.count > 0) { done(); }

      return div([ onClick(clickHandler) ], [
        text('click me')
      ]);
    }

    app({
      init: init,
      update: update,
      view: view,
      inputs: [ inputs ],
      rootElement: rootElement
    });

    inputs.push('first');
  });

});