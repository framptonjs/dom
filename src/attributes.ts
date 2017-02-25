import { AttrType } from './attributes/AttrType';
import { ClassAttribute } from './attributes/classes';
import { StyleAttribute } from './attributes/style';
import { DataAttribute } from './attributes/data';
import { PropertyType } from './attributes/props';
import { AttributeType } from './attributes/attrs';
import { EventAttribute } from './attributes/events';
import * as PropertyStatic from './attributes/props';


export * from './attributes/attrs';
export * from './attributes/AttrType';
export * from './attributes/classes';
export * from './attributes/style';
export * from './attributes/data';
export const Property = PropertyStatic;
export { PropertyType } from './attributes/props';
export { EventAttribute } from './attributes/events';


export type Attribute<T> =
  ClassAttribute |
  PropertyType |
  StyleAttribute |
  DataAttribute |
  AttributeType |
  EventAttribute<T>;


export interface Attributes<T> {
  [name: string]: Attribute<T>;
}


export function organizeAttributes<T>(attrs: Array<Attribute<T>>): Attributes<T> {
  const processed: Attributes<T> = {};
  const len: number = attrs.length;

  for (let i = 0; i < len; i++) {
    const attr: Attribute<T> = attrs[i];

    switch (attr.type) {
      case AttrType.CLASS_LIST:
        processed['classList'] = attr;
        break;

      case AttrType.STYLE:
        processed['style'] = attr;
        break;

      case AttrType.DATA:
        processed['data'] = attr;
        break;

      case AttrType.PROPERTY:
        processed[attr.name] = attr;
        break;

      case AttrType.ATTRIBUTE:
        processed[attr.name] = attr;
        break;

      case AttrType.EVENT:
        processed['event-' + attr.value.name] = attr;
        break;
    }
  }

  return processed;
}