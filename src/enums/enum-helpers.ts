import { IEnumValue } from './enum-value';

export function getEnumKey(data: IEnumValue[], lookupValue: number | string): number | undefined {
  return getEnum(data, lookupValue)?.key;
}
export function getEnumDisplayText(data: IEnumValue[], lookupValue: number | string): string | undefined {
  return getEnum(data, lookupValue)?.displayText;
}
export function getEnum(data: IEnumValue[], looupValue: number | string): IEnumValue | undefined {
  return data.find((f) => f.name === looupValue || f.key === looupValue);
}
