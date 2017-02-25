import { AttrType } from './AttrType';


/**
 * A Property is set as a property on a Node as in:
 * element.innerHTML = value;
 */
export interface PropertyType {
  type: AttrType.PROPERTY;
  name: string;
  value: string;
}


export function property(name: string, value: string): PropertyType {
  return {
    type: AttrType.PROPERTY,
    name: name,
    value: value
  };
}


export function innerHTML(html: string): PropertyType {
  return property('innerHTML', html);
}


export function value(val: string): PropertyType {
  return property('value', val);
}