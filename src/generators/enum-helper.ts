import { some } from 'lodash';
import { IPropertyTypeMetaData } from '../models/IPropertyTypeMetaData';
import { ISwagger, ISwaggerDefinition, ISwaggerPropertyDefinition } from '../models/swagger';
import { Helpers } from './helper';

export class EnumHelpers {
  public static getIsEnumRefType(swagger: ISwagger, item: ISwaggerPropertyDefinition, isArray: boolean) {
    let refItemName = '';
    if (isArray) {
      if (item.items && item.items.$ref) {
        refItemName = Helpers.removeDefinitionsRef(item.items.$ref);
      }
    } else {
      refItemName = Helpers.removeDefinitionsRef(item.$ref);
    }
    const refItem = swagger.definitions[refItemName];
    return EnumHelpers.getIsEnumType(refItem);
  }

  public static getIsEnumType(item: ISwaggerDefinition) {
    return !!(item && item.enum);
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
