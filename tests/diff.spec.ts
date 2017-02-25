import { diff } from '../src/diff';
import * as Elements from '../src/elements';
import * as Html from '../src/html';
import * as Keyed from '../src/keyed';
import { PatchType } from '../src/patches';
import { assert } from 'chai';


describe('diff', function() {
  it('should return empty patch set for identical nodes', function() {
    const div1 = Html.div([], []);
    const div2 = Html.div([], []);
    const actual = diff(div1, div2);
    const expected = [];

    assert.deepEqual(actual, expected);
  });

  it('should correctly diff reordered keyed nodes', function() {
    const div1 = Keyed.ul([], [ Keyed.li(1, [], []), Keyed.li(2, [], []) ]);
    const div2 = Keyed.ul([], [ Keyed.li(2, [], []), Keyed.li(1, [], []) ]);
    const actual = diff(div1, div2);
    const expected = [ {
      type: PatchType.REORDER,
      data: {
        inserts: [],
        deletes: [],
        moves: [ {
          node: Elements.vKeyedChild(2, Html.li([], [])),
          oldIndex: 1,
          newIndex: 0
        },
        {
          node: Elements.vKeyedChild(1, Html.li([], [])),
          oldIndex: 0,
          newIndex: 1
        } ]
      },
      domNode: null
    } ];

    assert.deepEqual(actual, expected);
  });

  it('should correctly diff deleted keyed nodes', function() {
    const div1 = Keyed.ul([], [ Keyed.li(1, [], []), Keyed.li(2, [], []) ]);
    const div2 = Keyed.ul([], [ Keyed.li(2, [], []) ]);
    const actual = diff(div1, div2);
    const expected = [ {
      type: PatchType.REORDER,
      data: {
        inserts: [],
        deletes: [ {
          node: Elements.vKeyedChild(1, Html.li([], []))
        } ],
        moves: [ {
          node: Elements.vKeyedChild(2, Html.li([], [])),
          oldIndex: 1,
          newIndex: 0
        } ]
      },
      domNode: null
    } ];

    assert.deepEqual(actual, expected);
  });

  it('should correctly diff inserted keyed nodes', function() {
    const div1 = Keyed.ul([], [
      Keyed.li(1, [], []),
      Keyed.li(2, [], [])
    ]);
    const div2 = Keyed.ul([], [
      Keyed.li(1, [], []),
      Keyed.li(2, [], []),
      Keyed.li(3, [], [])
    ]);
    const actual = diff(div1, div2);
    const expected = [ {
      type: PatchType.REORDER,
      data: {
        inserts: [ {
          index: 2,
          node: Elements.vKeyedChild(3, Html.li([], []))
        } ],
        deletes: [],
        moves: []
      },
      domNode: null
    } ];

    assert.deepEqual(actual, expected);
  });

  it('should correctly diff inserted keyed nodes that cause reorder', function() {
    const div1 = Keyed.ul([], [
      Keyed.li(1, [], []),
      Keyed.li(2, [], [])
    ]);
    const div2 = Keyed.ul([], [
      Keyed.li(1, [], []),
      Keyed.li(3, [], []),
      Keyed.li(2, [], [])
    ]);
    const actual = diff(div1, div2);
    const expected = [ {
      type: PatchType.REORDER,
      data: {
        inserts: [ {
          index: 1,
          node: Elements.vKeyedChild(3, Html.li([], []))
        } ],
        deletes: [],
        moves: [ {
          node: Elements.vKeyedChild(2, Html.li([], [])),
          oldIndex: 1,
          newIndex: 2
        } ]
      },
      domNode: null
    } ];

    assert.deepEqual(actual, expected);
  });
});