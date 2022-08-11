import { OpenAPIObject, PathItemObject, ReferenceObject, SchemaObject } from 'openapi3-ts';
import { defaultFilter, IGeneratorOptions } from './models/generator-options';
import { SchemaWrapperInfo } from './models/schema-info';
import { IEntity, IImportType, IPath, IReferenceProperty, ITemplateData, IValueProperty } from './models/template-data';
import { singular } from 'pluralize';
import { camelCase, kebabCase, snakeCase, startCase } from 'lodash';

export class OpenApiDocConverter {
  public readonly endAlphaNumRegex = /[A-z0-9]*$/s;
  public readonly startNumberregex = /^\d*/;
  constructor(private readonly options: IGeneratorOptions, private readonly apiDocument: OpenAPIObject) {}

  public convertDocument(): ITemplateData {
    const entities = this.convertEntities();
    const paths = this.convertPaths();
    return { entities, paths };
  }
  public convertPaths(): IPath[] {
    const paths: IPath[] = [];
    for (const key in this.apiDocument.paths) {
      const path = (this.apiDocument.paths[key] as PathItemObject) || {};
      let tagLookup = path.get || path.post || path.put;
      tagLookup = tagLookup || path.delete || path.patch;
      const tag: string = (tagLookup?.tags || ['unknown_endpoint'])[0];

      paths.push({
        tag: snakeCase(tag),
        endpoint: this.options.pathUrlFormattingCallBack ? this.options.pathUrlFormattingCallBack(key) : key,
      });
    }
    return paths;
  }
  public convertEntities(): IEntity[] {
    const entities: IEntity[] = [];

    for (const schemaName in this.apiDocument.components?.schemas) {
      if (this.apiDocument.components?.schemas[schemaName]) {
        const schemaWrapperInfo = new SchemaWrapperInfo(this.apiDocument.components?.schemas[schemaName]);
        if (schemaWrapperInfo.componentSchemaObject.enum) {
          this.buildSchemaWrapperInfoForEnum(schemaWrapperInfo);
        } else {
          this.buildSchemaWrapperInfo(schemaWrapperInfo);
        }
        schemaWrapperInfo.updateReferenceProperties(this.options);
        const entity: IEntity = {
          isEnum: schemaWrapperInfo.isEnum,
          enumValues: schemaWrapperInfo.enumValues.map((t) =>
            typeof t === 'string' || t instanceof String ? t : { ...t, key: t.key || 0 },
          ),
          name: schemaName,
          camelSingularName: camelCase(singular(schemaName)),
          description: schemaWrapperInfo.description,
          referenceProperties: schemaWrapperInfo.referenceProperties,
          valueProperties: schemaWrapperInfo.valueProperties.filter(this.options.valuePropertyTypeFilterCallBack || defaultFilter),
          importTypes: this.getImportTypes(schemaName, schemaWrapperInfo),
        };
        entities.push(entity);
      }
    }
    return entities.filter(this.options.typeFilterCallBack || defaultFilter);
  }

  public buildSchemaWrapperInfoForEnum(schemaWrapperInfo: SchemaWrapperInfo): void {
    schemaWrapperInfo.isEnum = true;
    schemaWrapperInfo.enumValues.push(
      ...(schemaWrapperInfo.componentSchemaObject.enum || []).map((x: string) => {
        const key = this.startNumberregex.exec(x)?.at(0);
        const name = this.endAlphaNumRegex.exec(x)?.at(0) || '';
        return { key: key ? +key : 0, name, titleName: startCase(name) };
      }),
    );
  }

  public buildSchemaWrapperInfo(schemaWrapperInfo: SchemaWrapperInfo): void {
    for (const propertyName in schemaWrapperInfo.componentSchemaObject.properties) {
      if (
        (schemaWrapperInfo.propertySchemaObject = schemaWrapperInfo.componentSchemaObject.properties[propertyName] as SchemaObject).type && // NOSONAR
        schemaWrapperInfo.propertySchemaObject.type !== 'array'
      ) {
        schemaWrapperInfo.valueProperties.push(this.convertSchemaObjectToPropertyType(propertyName, schemaWrapperInfo));
      } else {
        schemaWrapperInfo.propertyReferenceObject = schemaWrapperInfo.componentSchemaObject.properties[propertyName] as ReferenceObject;
        if (schemaWrapperInfo.propertyReferenceObject.$ref) {
          schemaWrapperInfo.referenceProperties.push(this.convertReferenceObjectToPropertyType(propertyName, schemaWrapperInfo));
        } else if (schemaWrapperInfo.propertySchemaObject.type === 'array' && schemaWrapperInfo.propertySchemaObject.items) {
          this.convertArray(propertyName, schemaWrapperInfo);
        }
      }
    }
  }

  public convertArray(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): void {
    const arraySchemaObject = schemaWrapperInfo.propertySchemaObject.items as SchemaObject;
    if (arraySchemaObject.type) {
      schemaWrapperInfo.valueProperties.push(this.convertArrayObjectToValuePropertyType(propertyName, schemaWrapperInfo));
    } else {
      schemaWrapperInfo.propertyReferenceObject = schemaWrapperInfo.propertySchemaObject.items as ReferenceObject;
      schemaWrapperInfo.referenceProperties.push(this.convertArrayObjectToReferencePropertyType(propertyName, schemaWrapperInfo));
    }
  }

  public convertSchemaObjectToPropertyType(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): IValueProperty {
    const required = this.getIsRequired(propertyName, schemaWrapperInfo);
    const validatorCount = this.getValidatorCount(propertyName, schemaWrapperInfo);
    const initialValue = this.getInitialValue(propertyName, schemaWrapperInfo);
    return {
      required,
      name: propertyName,
      initialValue,
      isArray: false,
      snakeCaseName: snakeCase(propertyName).toUpperCase(),
      typeScriptType: this.getPropertyTypeScriptType(schemaWrapperInfo),
      maxLength: schemaWrapperInfo.propertySchemaObject.maxLength,
      minLength: schemaWrapperInfo.propertySchemaObject.minLength,
      maximum: schemaWrapperInfo.propertySchemaObject.maximum,
      minimum: schemaWrapperInfo.propertySchemaObject.minimum,
      description: schemaWrapperInfo.propertySchemaObject.description,
      pattern: schemaWrapperInfo.propertySchemaObject.pattern,
      hasMultipleValidators: validatorCount > 1,
      hasValidators: validatorCount > 0,
    };
  }
  private convertValidator(validationValue: string | number | null | undefined): number {
    const exists = validationValue !== null && validationValue !== undefined;
    return +exists;
  }

  public convertArrayObjectToValuePropertyType(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): IValueProperty {
    const required = this.getIsRequired(propertyName, schemaWrapperInfo);
    const validatorCount = this.getValidatorCount(propertyName, schemaWrapperInfo);
    const initialValue = this.getInitialValue(propertyName, schemaWrapperInfo);
    return {
      required,
      typeScriptType: this.getPropertyTypeScriptType(schemaWrapperInfo),
      initialValue,
      name: propertyName,
      isArray: true,
      snakeCaseName: snakeCase(propertyName).toUpperCase(),
      hasMultipleValidators: false,
      hasValidators: validatorCount > 0,
    };
  }
  getInitialValue(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): string {
    const typescriptType = this.getPropertyTypeScriptType(schemaWrapperInfo);
    const isRequired = this.getIsRequired(propertyName, schemaWrapperInfo);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refName: string = ((schemaWrapperInfo?.componentSchemaObject?.properties || {})[propertyName] as SchemaObject).$ref;
    const refObject = (this.apiDocument.components?.schemas || {})[refName] as SchemaObject;
    const defaultValue = (schemaWrapperInfo.componentSchemaObject.default || refObject?.default || (refObject?.enum || [])[0]) as string;
    if (!isRequired) {
      return 'null';
    } else if (defaultValue && refObject.enum) {
      return `${schemaWrapperInfo.propertyReferenceObject['$ref']}.${defaultValue.split(' ').pop() as string}`;
    } else if (defaultValue) {
      return `'${defaultValue.split(' ').pop() as string}'`;
    } else if (typescriptType === 'Date') {
      return 'new Date()';
    } else if (typescriptType === 'boolean') {
      return 'false';
    } else if (typescriptType === 'number') {
      return '0';
    } else {
      return `''`;
    }
  }

  public convertArrayObjectToReferencePropertyType(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): IReferenceProperty {
    return {
      ...this.convertReferenceObjectToPropertyType(propertyName, schemaWrapperInfo),
      isArray: true,
    };
  }

  public convertReferenceObjectToPropertyType(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): IReferenceProperty {
    const propertySchema: SchemaObject = (this.apiDocument.components?.schemas || {})[this.parseRef(schemaWrapperInfo)];
    const required = this.getIsRequired(propertyName, schemaWrapperInfo);
    const validatorCount = this.getValidatorCount(propertyName, schemaWrapperInfo);
    const initialValue = this.getInitialValue(propertyName, schemaWrapperInfo);
    const typeName = this.parseRef(schemaWrapperInfo);
    return {
      required,
      name: propertyName,
      initialValue,
      snakeCaseName: snakeCase(propertyName).toUpperCase(),
      referenceTypeName: typeName,
      typeScriptType: typeName,
      isArray: false,
      isEnum: (propertySchema.enum || []).length > 0,
      hasValidators: validatorCount > 0,
    };
  }
  getValidatorCount(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): number {
    const required = this.getIsRequired(propertyName, schemaWrapperInfo);
    return (
      +required +
      +this.convertValidator(schemaWrapperInfo.propertySchemaObject.maxLength) +
      +this.convertValidator(schemaWrapperInfo.propertySchemaObject.minLength) +
      +this.convertValidator(schemaWrapperInfo.propertySchemaObject.maximum) +
      +this.convertValidator(schemaWrapperInfo.propertySchemaObject.minimum) +
      +this.convertValidator(schemaWrapperInfo.propertySchemaObject.pattern)
    );
  }

  public getPropertyTypeScriptType(schemaWrapperInfo: SchemaWrapperInfo): string {
    if (schemaWrapperInfo.propertySchemaObject.type === 'array' && schemaWrapperInfo.propertySchemaObject.items) {
      return (schemaWrapperInfo.propertySchemaObject.items as { type: string }).type;
    } else if (schemaWrapperInfo.propertySchemaObject.type === 'integer' && schemaWrapperInfo.propertySchemaObject.enum) {
      return 'string | number';
    } else if (schemaWrapperInfo.propertySchemaObject.type === 'integer') {
      return 'number';
    } else if (schemaWrapperInfo.propertySchemaObject.format === 'date-time') {
      return 'Date';
    }
    return schemaWrapperInfo.propertySchemaObject.type || 'string';
  }

  public parseRef(schemaWrapperInfo: SchemaWrapperInfo): string {
    let regexResult: RegExpExecArray;
    let result: string | null = null;
    if (
      schemaWrapperInfo.propertyReferenceObject.$ref &&
      // tslint:disable-next-line: no-conditional-assignment
      (regexResult = this.endAlphaNumRegex.exec(schemaWrapperInfo.propertyReferenceObject.$ref) as RegExpExecArray) // NOSONAR
    ) {
      schemaWrapperInfo.propertyReferenceObject.$ref = regexResult[0];
      result = schemaWrapperInfo.propertyReferenceObject.$ref;
    }
    return result || 'unknown';
  }

  public getImportTypes(entityName: string, schemaWrapperInfo: SchemaWrapperInfo): IImportType[] {
    const schemaProperties = ((this.apiDocument.components?.schemas || { properties: {} })[entityName] as SchemaObject).properties || {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const properties = Object.keys(schemaProperties).map((key) => ({
      key,
      ...schemaProperties[key],
      $ref: (schemaProperties[key] as ReferenceObject).$ref,
      items: (schemaProperties[key] as SchemaObject).items || {},
      type: (schemaProperties[key] as SchemaObject).type,
    }));
    return schemaWrapperInfo.referenceProperties
      .map((t) => t.referenceTypeName)
      .filter((value, index, array) => array.indexOf(value) === index)
      .map((value): IImportType => {
        const refSchema: SchemaObject = (this.apiDocument.components?.schemas || {})[value];
        const props = properties.filter((t) => t.items.$ref === value || t.$ref === value);
        return {
          name: value,
          kebabCasedTypeName: kebabCase(value),
          isEnum: (refSchema.enum || []).length > 0,
          areAllArrays: props.every((val) => val.type === 'array'),
          isSelfReferencing: entityName === value,
        };
      });
  }

  public getIsRequired(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): boolean {
    return (
      ((schemaWrapperInfo.componentSchemaObject.required || []).indexOf(propertyName) > -1 ||
        (schemaWrapperInfo.propertySchemaObject.nullable === undefined ? false : !schemaWrapperInfo.propertySchemaObject.nullable)) &&
      propertyName !== 'id'
    );
  }
}
