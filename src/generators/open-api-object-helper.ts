import { OpenAPIObject, ReferenceObject, SchemaObject } from 'openapi3-ts';

export function getSchemas(openAPIObject: OpenAPIObject): Array<{ name: string; schemaObject: SchemaObject }> {
  const components = openAPIObject.components || {};
  const schemas = components.schemas;
  const result: Array<{ name: string; schemaObject: SchemaObject }> = [];
  for (const key in schemas) {
    if (schemas.hasOwnProperty(key)) {
      const schemaObject = schemas[key];
      result.push({ name: key, schemaObject });
    }
  }
  return result;
}

export function getSchema(
  openAPIObject: OpenAPIObject,
  typeName: string,
): { name: string; schemaObject: SchemaObject } | undefined {
  const schemas = getSchemas(openAPIObject);
  return schemas.find(t => t.name === typeName);
}

export function getProperties(
  typeSchemaObject: SchemaObject,
): Array<{ name: string; schemaObject: SchemaObject | ReferenceObject }> | undefined {
  const properties = typeSchemaObject.properties || {};
  const result: Array<{ name: string; schemaObject: SchemaObject | ReferenceObject }> = [];
  for (const key in properties) {
    if (properties.hasOwnProperty(key)) {
      const schemaObject = properties[key];
      result.push({ name: key, schemaObject });
    }
  }
  return result;
}

export function getSchemaByRef(
  openAPIObject: OpenAPIObject,
  reference: SchemaObject | ReferenceObject,
): { name: string; schemaObject: SchemaObject } | undefined {
  const typeName = reference.$ref.split('/').pop();
  const schemas = getSchemas(openAPIObject);
  return schemas.find(t => t.name === typeName);
}
