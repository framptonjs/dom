import * as Dom from '../src/html';
import { NodeType, VNode, Html } from '../src/elements';
import { assert } from 'chai';


describe('Html', function() {
  describe('div', function() {
    it('should create empty div', function() {
      const actual: Html<any> = Dom.div([], []);
      const expected: VNode<void> = {
        type: NodeType.NODE,
        tag: 'div',
        attrs: {},
        children: [],
        domNode: undefined
      };

      assert.deepEqual(actual, expected);
    });
  });
});
