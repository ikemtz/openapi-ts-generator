import { describe, expect, it } from '@jest/globals';
import { EndPointsGenerator } from './endpoints.generator.ts';

describe('EndPointsGenerator', () => {
  it('should generate files', () => {
    const gen = new EndPointsGenerator({
      outputPath: './',
    });
    const response = gen.eliminateDupes({
      paths: [
        { tag: 'lookup', endpoint: 'api/v1/Lookup.{format}' },
        { tag: 'lookup', endpoint: 'api/v1/Lookup.{format}' },
        { tag: 'lookup', endpoint: 'api/v1/Lookup.{format}/GetLookup1' },
        { tag: 'lookup', endpoint: 'api/v1/Lookup.{format}/GetLookup2' },
        { tag: 'lookup_snake_test', endpoint: 'api/v1/Lookup.{format}' },
        { tag: 'lookup_snake_test', endpoint: 'api/v1/Lookup.{format}' },
      ],
    });
    expect(response).toMatchSnapshot();
  });
});
