import { OpenAPIObject } from 'openapi3-ts/oas31';
import { SchemaWrapperInfo } from './models/schema-info';
import { OpenApiDocConverter } from './openapidoc-converter';

describe('OpenApiDocConverter Tests', () => {
  it('should handle blank parseRef()', () => {
    const converter = new OpenApiDocConverter({ outputPath: '' }, {} as OpenAPIObject);
    const result = converter.parseRef({ propertyReferenceObject: {} } as SchemaWrapperInfo);
    expect(result).toBe('unknown');
  });

  it('should handle invalid getPropertyTypeScriptType()', (done) => {
    const converter = new OpenApiDocConverter({ outputPath: '' }, {} as OpenAPIObject);
    try {
      converter.getPropertyTypeScriptType({ propertySchemaObject: {} } as SchemaWrapperInfo);
      done.fail('This test should throw an exception');
    } catch (err) {
      expect(err).toMatchSnapshot();
      done();
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
