import { endsWith, find, has, some, upperFirst } from 'lodash';
import { GeneratorOptions } from '../models/GeneratorOptions';
import { IPropertyTypeMetaData } from '../models/IPropertyTypeMetaData';
import { ITypeMetaData } from '../models/ITypeMetaData';
import { ISwaggerDefinition, ISwaggerDefinitionProperties } from '../models/swagger';
import { Helpers } from './helper';

export class TypeHelpers {
  public static getSubTypeRequired(item: ISwaggerDefinition) {
    if (item.allOf) {
      const required = (item.allOf[1].required as string[]) || [];
      return required;
    }
    return [];
  }

  public static getImportType(type: string, isArray: boolean) {
    if (isArray) {
      const result = TypeHelpers.removeGenericArray(type, isArray);
      return result;
    }
    type = TypeHelpers.removeGenericType(type);

    return type;
  }

  public static removeGenericType(type: string) {
    if (TypeHelpers.getIsGenericType(type)) {
      type = type.substring(0, type.indexOf('<'));
    }
    return type;
  }

  public static getIsGenericType(type: string) {
    return type.indexOf('[') !== -1 || type.indexOf('<') !== -1;
  }

  public static removeGenericArray(type: string, isArray: boolean) {
    if (isArray) {
      const result = type.replace('Array<', '').replace('>', '');
      return result;
    }
    return type;
  }
  public static convertGenericTypeName(typeName: string) {
    return typeName.replace('[', '<').replace(']', '>');
  }
  public static getBaseType(
    superTypeName: string,
    typeCollection: ITypeMetaData[],
    item: ISwaggerDefinition,
    options: GeneratorOptions,
  ) {
    if (item.allOf) {
      const type = Helpers.removeDefinitionsRef(item.allOf[0].$ref);
      const typeName = TypeHelpers.getTypeName(type, options);
      const baseType = TypeHelpers.findTypeInTypeCollection(typeCollection, typeName);
      return baseType;
    }
  }

  public static getTypeName(type: string, options: GeneratorOptions) {
    let typeName: string;
    if (TypeHelpers.getIsGenericType(type)) {
      const startGenericT = type.indexOf('[');
      const startGenericType = type.lastIndexOf('.', startGenericT) + 1;
      typeName = type.substring(startGenericType);
      typeName = TypeHelpers.convertGenericTypeName(typeName);
      typeName = TypeHelpers.getTypeNameWithoutSuffixesToRemove(typeName, options);
    } else {
      typeName = type.split('.').pop() || '';
      typeName = TypeHelpers.getTypeNameWithoutSuffixesToRemove(typeName, options);
      // C# Object affects Typescript Object - fix this
      if (typeName === 'Object') {
        typeName = 'SystemObject';
      }
      // classNameSuffixesToRemove
    }
    return upperFirst(typeName);
  }

  public static getTypeNameWithoutSuffixesToRemove(typeName: string, options: GeneratorOptions) {
    if (!options.typeNameSuffixesToRemove) {
      return typeName;
    }
    const typeNameSuffixesToRemove = options.typeNameSuffixesToRemove;
    typeNameSuffixesToRemove.forEach(item => {
      if (endsWith(typeName, item)) {
        typeName = typeName.slice(0, -item.length);
      }
    });
    return typeName;
  }

  public static findTypeInTypeCollection(typeCollection: ITypeMetaData[], typeName: string): ITypeMetaData {
    const result = find(typeCollection, type => {
      return type.typeName === typeName;
      // return type.typeName === typeName && type.namespace === namespace;
    });
    return result as ITypeMetaData;
  }

  public static getTypeNameWithoutNamespacePrefixesToRemove(key: string, options: GeneratorOptions) {
    if (!options.namespacePrefixesToRemove) {
      return key;
    }
    const namespaces = options.namespacePrefixesToRemove;
    namespaces.forEach(item => {
      key = key.replace(item, '');
      if (key[0] === '.') {
        key = key.substring(1);
      }
    });
    return key;
  }

  public static getGenericType(type: string) {
    if (TypeHelpers.getIsGenericType(type)) {
      const result = /\<(.*)\>/.exec(type);
      if (result) {
        return result[1];
      }
    }
    return undefined;
  }
  public static convertGenericToGenericType(typeName: string) {
    return typeName.replace(/\<.*\>/, '<T>');
  }

  public static getIsSubType(item: ISwaggerDefinition) {
    return item.allOf !== undefined;
  }

  public static getHasSubTypeProperty(properties: ISwaggerDefinitionProperties, options: GeneratorOptions) {
    return has(properties, options.subTypePropertyName);
  }

  public static getIsUniqueImportType(
    currentTypeName: string | undefined,
    baseType: ITypeMetaData | undefined,
    typeProperties: IPropertyTypeMetaData[],
  ) {
    const baseTypeName = baseType ? baseType.typeName : undefined;
    if (currentTypeName === baseTypeName) {
      return false;
    }
    return !some(typeProperties, property => {
      return property.importType === currentTypeName;
    });
  }
}
