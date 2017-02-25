import { diffClasses } from '../../src/utils/diff-classes';
import { AttrType } from '../../src/attributes';
import { ClassMap, ClassAttribute } from '../../src/attributes/classes';
import { assert } from 'chai';


describe('utils/diff-classes', function() {
  it('should return undefined for identical class descriptions', function() {
    const class1: ClassAttribute = {
      type: AttrType.CLASS_LIST,
      value: {
        'test-one': true,
        'test-two': false,
        'test-three': true
      }
    };
    const class2: ClassAttribute = {
      type: AttrType.CLASS_LIST,
      value: {
        'test-one': true,
        'test-two': false,
        'test-three': true
      }
    };
    const actual = diffClasses(class1, class2);
    const expected = undefined;

    assert.deepEqual(actual, expected);
  });

  it('should correctly diff class descriptions', function() {
    const class1: ClassAttribute = {
      type: AttrType.CLASS_LIST,
      value: {
        'test-one': true,
        'test-two': false,
        'test-three': true
      }
    };
    const class2: ClassAttribute = {
      type: AttrType.CLASS_LIST,
      value: {
        'test-one': false,
        'test-two': true,
        'test-three': true,
        'test-four': true
      }
    };
    const actual = diffClasses(class1, class2);
    const expected = {
      type: AttrType.CLASS_LIST,
      value: {
        'test-one': false,
        'test-two': true,
        'test-four': true
      }
    };

    assert.deepEqual(actual, expected);
  });
});