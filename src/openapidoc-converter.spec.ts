import { describe, it, expect } from '@jest/globals';
import { OpenAPIObject } from 'openapi3-ts/oas31';
import { SchemaWrapperInfo } from './models/schema-info.ts';
import { OpenApiDocConverter } from './openapidoc-converter.ts';

describe('OpenApiDocConverter Tests', () => {
  it('should handle blank parseRef()', () => {
    const converter = new OpenApiDocConverter({ outputPath: '' }, {} as OpenAPIObject);
    const result = converter.parseRef({ propertyReferenceObject: {} } as SchemaWrapperInfo);
    expect(result).toBe('unknown');
  });

  it('should handle invalid getPropertyTypeScriptType()', () => {
    const converter = new OpenApiDocConverter({ outputPath: '' }, {} as OpenAPIObject);
    let errorThrown = false;
    try {
      converter.getPropertyTypeScriptType({ propertySchemaObject: null } as never);
    } catch (err) {
      expect(err).toMatchSnapshot();
      errorThrown = true;
    }
    if (!errorThrown) {
      throw new Error('This test should have thrown an exception');
    }
  });

  it('should properly convertPaths', () => {
    const converter = new OpenApiDocConverter({ outputPath: '' }, {
      paths: {
        GET_Employees: {
          get: {
            tags: ['Employees'],
          },
        },
        POST_Employees: {
          post: {
            tags: ['Employees'],
          },
        },
        PUT_Employees: {
          put: {
            tags: ['Employees'],
          },
        },
        DELETE_Employees: {
          delete: {
            tags: ['Employees'],
          },
        },
        PATCH_Employees: {
          patch: {
            tags: ['Employees'],
          },
        },
      },
    } as never);
    const result = converter.convertPaths();
    expect(result).toMatchSnapshot();
  });
});
