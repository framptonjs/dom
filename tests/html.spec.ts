import * as Html from '../src/html';
import { NodeType, VNode } from '../src/elements';
import { assert } from 'chai';


describe('Html', function() {
  describe('div', function() {
    it('should create empty div', function() {
      const actual = Html.div([], []);
      const expected: VNode<void> = {
        type: NodeType.NODE,
        tag: 'div',
        attrs: {},
        children: [],
        domNode: undefined
      };

      console.log('actual: ', JSON.stringify(actual, null, 2));
      console.log('expected: ', JSON.stringify(expected, null, 2));

      assert.deepEqual(actual, expected);
    });
  });
});