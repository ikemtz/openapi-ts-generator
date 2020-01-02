import { endsWith, find, has, some, upperFirst } from 'lodash';
import { isSchemaObject, SchemaObject, SchemasObject } from 'openapi3-ts';
import { GeneratorOptions } from '../models/GeneratorOptions';
import { IPropertyTypeMetaData } from '../models/IPropertyTypeMetaData';
import { ITypeMetaData } from '../models/ITypeMetaData';
import { Helpers } from './helper';

export class TypeHelpers {
  public static getSubTypeRequired(item: SchemaObject) {
    if (item.allOf) {
      const allof = item.allOf.find(t => isSchemaObject(t)) as SchemaObject;
      const required = allof.required || [];
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
    item: SchemaObject,
    options: GeneratorOptions,
  ) {
    if (item.allOf) {
      const type = Helpers.removeDefinitionsRef(item.allOf[0].$ref);
      const typeName = TypeHelpers.getTypeName(type, options);
      const baseType = TypeHelpers.findTypeInTypeCollection(typeCollection, typeName);
      return baseType;
    }
    return undefined;
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
  public static getTypeInterfaceName(type: string, options: GeneratorOptions) {
    let typeName: string;
    if (TypeHelpers.getIsGenericType(type)) {
      const startGenericT = type.indexOf('[');
      const startGenericType = type.lastIndexOf('.', startGenericT) + 1;
      typeName = type.substring(startGenericType);
      typeName = TypeHelpers.convertGenericTypeName(typeName);
      typeName = TypeHelpers.getTypeNameWithoutSuffixesToRemove(typeName, options);
    } else {
      typeName = type.split('.').pop() || '';
      typeName = 'I' + TypeHelpers.getTypeNameWithoutSuffixesToRemove(typeName, options);
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

  public static getIsSubType(item: SchemaObject) {
    return item.allOf !== undefined;
  }

  public static getHasSubTypeProperty(properties: SchemasObject | undefined, options: GeneratorOptions) {
    return properties ? has(properties, options.subTypePropertyName) : undefined;
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
