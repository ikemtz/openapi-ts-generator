import { IEnumValue } from './enum-value';

/**
 * Retrieves the key of an enum value from a list of enum values.
 *
 * @param data - An array of enum values implementing the `IEnumValue` interface.
 * @param lookupValue - The value to look up in the enum, which can be a number or a string.
 * @returns The key of the enum value if found, otherwise `undefined`.
 */
export function getEnumKey(data: IEnumValue[], lookupValue: number | string): number | string | undefined {
  return getEnum(data, lookupValue)?.key;
}
/**
 * Retrieves the display text for a given enum value.
 *
 * @param data - An array of enum values implementing the `IEnumValue` interface.
 * @param lookupValue - The value to look up in the enum, which can be a number or a string.
 * @returns The display text associated with the given enum value, or `undefined` if not found.
 */
export function getEnumDisplayText(data: IEnumValue[], lookupValue: number | string): string | undefined {
  return getEnum(data, lookupValue)?.displayText;
}
/**
 * Retrieves an enum value from a list of enum values based on a lookup value.
 *
 * @param data - An array of enum values to search within.
 * @param lookupValue - The value to look up, which can be either a number or a string.
 * @returns The matching enum value, or `undefined` if no match is found.
 */
export function getEnum(data: IEnumValue[], lookupValue: number | string): IEnumValue | undefined {
  return data.find((f) => f.name === lookupValue || f.key === lookupValue);
}
