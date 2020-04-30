import { IEntity, IValueProperty } from './template-data';

export class NrsrxOptions {
  public static typeFilterCallBack(val: IEntity, i: number, arr: IEntity[]) {
    return !val.name.endsWith('ODataEnvelope');
  }
  public static valuePropertyTypeFilterCallBack(val: IValueProperty, i: number, arr: IValueProperty[]) {
    return !val.name.startsWith('created') && !val.name.startsWith('updated');
  }
}
