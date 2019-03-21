import { forEach, has, indexOf, keys, lowerFirst, snakeCase } from 'lodash';
import { getImportFile, getTypeFromDescription, hasTypeFromDescription } from '../file-utils';
import { GeneratorOptions } from '../models/GeneratorOptions';
import { IPropertyTypeMetaData } from '../models/IPropertyTypeMetaData';
import { ITypeMetaData } from '../models/ITypeMetaData';
import {
  ISwagger,
  ISwaggerDefinition,
  ISwaggerDefinitionProperties,
  ISwaggerPropertyDefinition,
} from '../models/swagger';
import { IValidators } from '../models/Validators';
import { EnumHelpers } from './enum-helper';
import { Helpers } from './helper';
import { NameSpaceHelpers } from './namespace-helpers';
import { TypeHelpers } from './type-helper';

export class PropertyHelpers {
  public static getSubTypeProperties(item: ISwaggerDefinition, baseType: ITypeMetaData) {
    if (item.allOf) {
      const properties = item.allOf[1].properties;
      return properties;
    }
    return null;
  }
  public static getHasSubTypeProperty(properties: ISwaggerDefinitionProperties, options: GeneratorOptions) {
    return has(properties, options.subTypePropertyName);
  }

  public static fillTypeProperties(
    swagger: ISwagger,
    type: ITypeMetaData,
    required: string[],
    properties: ISwaggerDefinitionProperties | null,
    item: ISwaggerDefinition,
    key: string,
    options: GeneratorOptions,
    suffix: string,
    fileSuffix: string,
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
        suffix,
        baseType,
      );
      if (property) {
        type.properties.push(property);
      }
    });
  }

  public static getTypePropertyDefinition(
    swagger: ISwagger,
    type: ITypeMetaData,
    required: string[],
    item: ISwaggerPropertyDefinition,
    key: string,
    options: GeneratorOptions,
    suffix: string,
    baseType?: ITypeMetaData,
  ): IPropertyTypeMetaData | undefined {
    const staticFieldName = `${snakeCase(key).toUpperCase()}_FIELD_NAME`;
    let isRefType = !!item.$ref;
    const isArray = item.type === 'array';
    const isEnum =
      (item.type === 'string' && !!item.enum) ||
      (isArray && item.items && item.items.type === 'string' && !!item.items.enum) ||
      ((isRefType || isArray) && EnumHelpers.getIsEnumRefType(swagger, item, isArray));
    // enum ref types are not handles as model types (they are handled in the enumGenerator)
    if (isEnum) {
      isRefType = false;
    }
    const propertyType = PropertyHelpers.getPropertyType(item, key, options, isEnum);
    if (propertyType) {
      const isComplexType = isRefType || isArray; // new this one in constructor
      const isImportType = isRefType || (isArray && item.items && item.items.$ref && !isEnum);
      const importType =
        isImportType && propertyType ? TypeHelpers.getImportType(propertyType.typeName, isArray) : undefined;
      const importFile =
        isImportType && propertyType
          ? getImportFile(importType, propertyType.namespace, type.pathToRoot, suffix)
          : undefined;
      const importTypeIsPropertyType = importType === type.typeName;
      const isUniqueImportType =
        isImportType &&
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
        name: key,
        staticFieldName,
        typeName: propertyType.typeName,
        namespace: propertyType.namespace,
        fullNamespace: NameSpaceHelpers.getNamespace(type.typeName, options, false),
        description: item.description,
        hasValidation,
        isComplexType,
        isImportType: importType ? true : false,
        isUniqueImportType: isUniqueImportType ? true : false,
        importType,
        importFile,
        isEnum,
        isUniqueImportEnumType,
        importEnumType,
        isArray,
        isArrayComplexType: propertyType.isArrayComplexType,
        arrayTypeName: propertyType.arrayTypeName,
        validators,
        enum: item.enum,
      };
      return property;
    }
    return undefined;
  }

  public static getTypePropertyValidatorDefinitions(
    required: string[],
    item: ISwaggerPropertyDefinition,
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
    item: ISwaggerPropertyDefinition,
    name: string,
    options: GeneratorOptions,
    isEnum: boolean,
  ) {
    const result: IPropertyTypeMetaData = {
      description: '',
      hasValidation: false,
      isEnum: false,
      isArray: false,
      isArrayComplexType: false,
      isComplexType: false,
      isImportType: false,
      isUniqueImportEnumType: false,
      isUniqueImportType: false,
      name,
      staticFieldName: name,
      typeName: item.type || '',
    };
    if (item.type) {
      result.typeName = item.type;
      if (item.type === 'integer') {
        result.typeName = 'number';
      }
      if (item.type === 'string' && item.format === 'date') {
        result.typeName = 'Date';
      }
      if (item.type === 'string' && item.format === 'date-time') {
        result.typeName = 'Date';
      }
      if (item.type === 'string' && item.enum) {
        result.typeName = `${name}`;
      }
      if (item.type === 'array' && item.items) {
        const arrayPropType = PropertyHelpers.getPropertyType(item.items, name, options, isEnum);
        if (arrayPropType) {
          result.typeName = `Array<${arrayPropType.typeName}>`;
          result.namespace = arrayPropType.namespace;
          result.isArrayComplexType = !isEnum ? !!item.items.$ref : false;
          result.arrayTypeName = arrayPropType.typeName;
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
    if (item.$ref) {
      const type = Helpers.removeDefinitionsRef(item.$ref);
      result.typeName = TypeHelpers.getTypeName(type, options);
      result.namespace = NameSpaceHelpers.getNamespace(type, options, true);
      result.fullNamespace = NameSpaceHelpers.getNamespace(type, options, false);

      // TODO add more C# primitive types
      if (TypeHelpers.getIsGenericType(result.typeName)) {
        const genericTType = TypeHelpers.getGenericType(result.typeName);
        if (genericTType && genericTType === 'System.DateTime') {
          result.typeName = result.typeName.replace(genericTType, 'Date');
        }
      }

      return result;
    }
  }
}
