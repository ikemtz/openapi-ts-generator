import { some } from 'lodash';
import {
  isReferenceObject,
  isSchemaObject,
  OpenAPIObject,
  ReferenceObject,
  SchemaObject,
  SchemasObject,
} from 'openapi3-ts';
import { IPropertyTypeMetaData } from '../models/IPropertyTypeMetaData';
import { Helpers } from './helper';

export class EnumHelpers {
  public static getIsEnumRefType(swagger: OpenAPIObject, item: SchemasObject | ReferenceObject, isArray: boolean) {
    let refItemName = '';
    if (isArray && isSchemaObject(item)) {
      const schemaObject = item as SchemaObject;
      const items = schemaObject.items as ReferenceObject;
      refItemName = Helpers.removeDefinitionsRef(items.$ref);
    } else if (isReferenceObject(item)) {
      refItemName = Helpers.removeDefinitionsRef(item.$ref);
    }
    const refItem = swagger.components?.schemas?.[refItemName];
    return EnumHelpers.getIsEnumType(refItem);
  }

  public static getIsEnumType(item: SchemaObject | undefined) {
    return !!(item && item.type === 'enum');
  }

  public static getIsUniqueImportEnumType(
    currentTypeName: string | undefined,
    typeProperties: IPropertyTypeMetaData[],
  ) {
    return !some(typeProperties, property => {
      return property.importEnumType === currentTypeName;
    });
  }
}
