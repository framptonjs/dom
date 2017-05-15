import * as Elements from '../src/html';
import * as Attrs from '../src/attributes/attrs';
import { NodeType, VNode, Html } from '../src/elements';
import { scene } from '../src/scene';
import { assert } from 'chai';


describe('scene', function() {
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

  it('should render initial view into DOM', function(done) {
    const view: Html<any> =
      Elements.div([ Attrs.id('test-id') ], []);

    const scheduler =
      scene(rootElement, view, () => {});

    setTimeout(() => {
      const actual: number =
        rootElement.querySelectorAll('#test-id').length;

      const expected: number =
        1;

      assert.equal(actual, expected);

      done();
    }, 100);
  });
});
