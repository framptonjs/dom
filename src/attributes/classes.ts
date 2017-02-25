import { AttrType } from './AttrType';


export interface ClassMap {
  [name: string]: boolean;
}


export interface ClassAttribute {
  type: AttrType.CLASS_LIST;
  value: ClassMap;
}


function organizeClasses(classes: string): ClassMap {
  const parts: Array<string> = classes.trim().split(' ');
  const classMap: ClassMap = {};

  for (let i = 0; i < parts.length; i++) {
    const className = parts[i];
    classMap[className] = true;
  }

  return classMap;
}


export function className(val: string): ClassAttribute {
  return {
    type: AttrType.CLASS_LIST,
    value: organizeClasses(val)
  };
}


export function classList(val: ClassMap): ClassAttribute {
  return {
    type: AttrType.CLASS_LIST,
    value: val
  };
}