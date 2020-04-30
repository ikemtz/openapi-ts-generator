import { IEntity, IValueProperty } from './template-data';

export function nrsrxTypeFilterCallBack(val: IEntity, i: number, arr: IEntity[]) {
  return !val.name.endsWith('ODataEnvelope');
}
export function nrsrxValuePropertyTypeFilterCallBack(val: IValueProperty, i: number, arr: IValueProperty[]) {
  return !val.name.startsWith('created') && !val.name.startsWith('updated');
}
