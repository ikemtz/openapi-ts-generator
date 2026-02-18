import { describe, expect, it } from '@jest/globals';
import { getEnumDisplayText, getEnumKey } from './enum-helpers.ts';
import { IEnumValue } from './enum-value.ts';

export enum CourseTypes {
  Lab = 76,
  Online = 79,
  OnSite = 83,
}

export enum CourseTypeNames {
  LAB = 'Lab',
  ONLINE = 'Online',
  ON_SITE = 'OnSite',
}

export const courseTypeValues: IEnumValue[] = [
  { key: 76, name: 'Lab', displayText: 'Lab' },
  { key: 79, name: 'Online', displayText: 'Online' },
  { key: 83, name: 'OnSite', displayText: 'On Site' },
];

describe('Enum Helpers', () => {
  it('should get by key', () => {
    const numResult = getEnumKey(courseTypeValues, 'Lab');
    expect(CourseTypes.Lab).toBe(numResult);
  });

  it('should get by display text', () => {
    const stringResult = getEnumDisplayText(courseTypeValues, 'Lab');
    expect(CourseTypeNames.LAB).toBe(stringResult);
  });
});
