import { forEach, has, indexOf, keys, lowerFirst, snakeCase } from 'lodash';
import { isSchemaObject, OpenAPIObject, SchemaObject, SchemasObject } from 'openapi3-ts';
import { getImportFile, getTypeFromDescription, hasTypeFromDescription } from '../file-utils';
import { GeneratorOptions } from '../models/GeneratorOptions';
import { IPropertyTypeMetaData } from '../models/IPropertyTypeMetaData';
import { ITypeMetaData } from '../models/ITypeMetaData';
import { IValidators } from '../models/validators';
import { EnumHelpers } from './enum-helper';
import { Helpers } from './helper';
import { NameSpaceHelpers } from './namespace-helpers';
import { getSchema, getSchemaByRef } from './open-api-object-helper';
import { TypeHelpers } from './type-helper';

export class PropertyHelpers {
  public static getSubTypeProperties(item: SchemaObject, baseType: ITypeMetaData) {
    if (item.allOf) {
      const properties = (item.allOf[1] as SchemaObject)?.properties;
      return properties;
    }
    return null;
  }
  public static getHasSubTypeProperty(
    properties: {
      [propertyName: string]: SchemaObject;
    },
    options: GeneratorOptions,
  ) {
    return has(properties, options.subTypePropertyName);
  }

  public static fillTypeProperties(
    swagger: OpenAPIObject,
    type: ITypeMetaData,
    required: string[],
    properties: SchemasObject | undefined,
    options: GeneratorOptions,
    baseType?: ITypeMetaData,
  ) {
    type.properties = [];
    forEach(properties, (pitem, pkey) => {
      const property = PropertyHelpers.getTypePropertyDefinition(
        swagger,
        type,
        required,
        pitem,
        pkey,
        options,
        baseType,
      );
      if (property) {
        type.properties.push(property);
      }
    });
  }

  public static getTypePropertyDefinition(
    swagger: OpenAPIObject,
    type: ITypeMetaData,
    required: string[],
    item: SchemaObject,
    key: string,
    options: GeneratorOptions,
    baseType?: ITypeMetaData,
  ): IPropertyTypeMetaData | undefined {
    const staticFieldName = `${snakeCase(key).toUpperCase()}`;
    const isRefType = !!item.$ref;
    const isArray = item.type === 'array';
    const isEnum =
      EnumHelpers.getIsEnumType(item) ||
      (isArray && item.items && isSchemaObject(item.items) && item.items.type === 'string' && !!item.items.enum) ||
      ((isRefType || isArray) && EnumHelpers.getIsEnumRefType(swagger, item, isArray));
    // enum ref types are not handles as model types (they are handled in the enumGenerator)
    const propertyType = PropertyHelpers.getPropertyType(swagger, item, key, options, isEnum);
    if (propertyType) {
      const isComplexType = isRefType || isArray; // new this one in constructor
      const importType = propertyType.isImportType
        ? TypeHelpers.getImportType(propertyType.typeName, isArray)
        : undefined;
      const importFile = propertyType.isImportType
        ? getImportFile(importType, propertyType.namespace, type.pathToRoot, isEnum)
        : undefined;
      const importTypeIsPropertyType = importType === type.typeName;
      const isUniqueImportType =
        !isEnum &&
        propertyType.isImportType &&
        !importTypeIsPropertyType &&
        TypeHelpers.getIsUniqueImportType(importType, baseType, type.properties); // import this type
      const validators = PropertyHelpers.getTypePropertyValidatorDefinitions(
        required,
        item,
        key,
        propertyType.typeName,
        isEnum,
      );
      const hasValidation = keys(validators.validation).length > 0;

      const importEnumType = isEnum ? TypeHelpers.removeGenericArray(propertyType.typeName, isArray) : undefined;
      const isUniqueImportEnumType = isEnum && EnumHelpers.getIsUniqueImportEnumType(importEnumType, type.properties); // import this enumType
      const property: IPropertyTypeMetaData = {
        ...propertyType,
        name: key,
        staticFieldName,
        fullNamespace: NameSpaceHelpers.getNamespace(type.typeName, options, false),
        description: item.description,
        hasValidation,
        isComplexType,
        isImportType: !!importType,
        isUniqueImportType: !!isUniqueImportType,
        importType,
        importFile,
        isEnum,
        isUniqueImportEnumType,
        importEnumType,
        isArray,
        validators,
        enum: item.enum,
      };
      return property;
    }
    return undefined;
  }

  public static getTypePropertyValidatorDefinitions(
    required: string[],
    item: SchemaObject,
    key: string,
    typeName: string,
    isEnum: boolean,
  ): IValidators {
    const isRequired = indexOf(required, key) !== -1;
    // console.log('key=', key, 'typeName', typeName, 'item=', item, 'enum=', item.enum);

    const validators: IValidators = { validation: {}, validatorArray: [] };
    if (isRequired) {
      validators.validation.required = isRequired;
      validators.validatorArray.push('Validators.required');
    }
    if (has(item, 'minimum')) {
      validators.validation.minimum = item.minimum;
      validators.validatorArray.push(`minValueValidator(${item.minimum})`);
    }
    if (has(item, 'maximum')) {
      validators.validation.maximum = item.maximum;
      validators.validatorArray.push(`maxValueValidator(${item.maximum})`);
    }
    if (isEnum) {
      validators.validation.enum = `'${item.enum}'`;
      validators.validatorArray.push(`enumValidator(${typeName})`);
    }
    if (has(item, 'minLength')) {
      validators.validation.minLength = item.minLength;
      validators.validatorArray.push(`Validators.minLength(${item.minLength})`);
    }
    if (has(item, 'maxLength')) {
      validators.validation.maxLength = item.maxLength;
      validators.validatorArray.push(`Validators.maxLength(${item.maxLength})`);
    }
    if (has(item, 'pattern')) {
      validators.validation.pattern = `'${item.pattern}'`;
      validators.validatorArray.push(`Validators.pattern('${item.pattern}')`);
    }
    return validators;
  }

  public static getPropertyType(
    swagger: OpenAPIObject,
    item: SchemaObject,
    name: string,
    options: GeneratorOptions,
    isEnum: boolean,
  ) {
    const result: IPropertyTypeMetaData = {
      description: '',
      hasValidation: false,
      isEnum,
      isArray: false,
      isArrayComplexType: false,
      isComplexType: false,
      isImportType: false,
      isUniqueImportEnumType: false,
      isUniqueImportType: false,
      name,
      staticFieldName: name,
      typeName: item.type || '',
      interfaceTypeName: '',
    };
    if (item.type) {
      result.typeName = item.type;
      result.interfaceTypeName = item.type;
      if (item.type === 'integer') {
        result.typeName = 'number';
        result.interfaceTypeName = 'number';
      }
      if (item.type === 'string' && item.format === 'date-time') {
        result.typeName = 'Date';
        result.interfaceTypeName = 'Date';
      }
      if (item.type === 'string' && item.enum) {
        result.typeName = `${name}`;
        result.interfaceTypeName = `${name}`;
      }
      if (item.type === 'array' && item.items) {
        const arrayPropType = PropertyHelpers.getPropertyType(swagger, item.items, name, options, isEnum);
        if (arrayPropType) {
          const schemaObject = getSchemaByRef(swagger, item.items);
          result.arrayTypeName = arrayPropType.typeName || TypeHelpers.getTypeName(schemaObject?.name || '', options);
          result.typeName = `Array<${result.arrayTypeName}>`;
          result.interfaceTypeName = `Array<I${result.arrayTypeName}>`;
          result.isImportType = !!schemaObject;
          result.namespace = arrayPropType.namespace;
          result.isArrayComplexType = !isEnum ? !!item.items.$ref : false;
        }
      }
      // description may contain an overrule type for enums, eg /** type CoverType */
      if (item.description && hasTypeFromDescription(item.description)) {
        result.typeName = lowerFirst(getTypeFromDescription(item.description));
        // fix enum array with overrule type
        if (item.type === 'array' && item.items) {
          result.arrayTypeName = result.typeName;
          result.typeName = `Array<${result.typeName}>`;
        }
      }

      return result;
    }
    if (!item.$ref && item.allOf) {
      item = item.allOf[0];
    }
    if (item.$ref) {
      const type = Helpers.removeDefinitionsRef(item.$ref);
      const schema = getSchema(swagger, type);

      result.isImportType = true;
      if (!schema) {
        throw new Error('Schema not found!');
      } else if (schema.schemaObject.type === 'object') {
        result.typeName = TypeHelpers.getTypeName(type, options);
        result.interfaceTypeName = isEnum ? result.typeName || '' : TypeHelpers.getTypeInterfaceName(type, options);
        result.namespace = NameSpaceHelpers.getNamespace(type, options, true);
        result.fullNamespace = NameSpaceHelpers.getNamespace(type, options, false);

        // TODO add more C# primitive types
        if (TypeHelpers.getIsGenericType(result.typeName)) {
          const genericTType = TypeHelpers.getGenericType(result.typeName);
          if (genericTType && genericTType === 'System.DateTime') {
            result.typeName = result.typeName.replace(genericTType, 'Date');
          }
        }
      } else if (schema.schemaObject.type === 'integer') {
        result.typeName = 'number';
        result.interfaceTypeName = 'number';
        result.isUniqueImportType = false;
        result.isUniqueImportEnumType = false;
        result.isEnum = false;
        result.isImportType = false;
      }

      return result;
    }
  }
}
