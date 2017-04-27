import { AttrType } from './AttrType';


/**
 * A Property is set as a property on a Node as in:
 * element.innerHTML = value;
 */
export interface Property {
  type: AttrType.PROPERTY;
  name: string;
  value: string;
}


export function property(name: string, value: string): Property {
  return {
    type: AttrType.PROPERTY,
    name: name,
    value: value
  };
}


export function innerHTML(html: string): Property {
  return property('innerHTML', html);
}


export function value(val: string): Property {
  return property('value', val);
}


export function checked(val: 'true' | 'false'): Property {
  return property('checked', val);
}