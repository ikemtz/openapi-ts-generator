import { OpenAPIObject, PathItemObject, ReferenceObject, SchemaObject } from 'openapi3-ts';
import { defaultFilter, IGeneratorOptions } from './models/generator-options';
import { SchemaWrapperInfo } from './models/schema-info';
import { IEntity, IImportType, IPath, IReferenceProperty, ITemplateData, IValueProperty } from './models/template-data';
import _ = require('lodash');

export class OpenApiDocConverter {
  public readonly regex = /[A-z0-9]*$/s;
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
        tag: _.snakeCase(tag),
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
        this.buildSchemaWrapperInfo(schemaWrapperInfo);
        schemaWrapperInfo.updateReferenceProperties(this.options);
        const entity = {
          name: schemaName,
          referenceProperties: schemaWrapperInfo.referenceProperties,
          valueProperties: schemaWrapperInfo.valueProperties.filter(this.options.valuePropertyTypeFilterCallBack || defaultFilter),
          importTypes: this.getImportTypes(schemaName, schemaWrapperInfo),
        };
        entities.push(entity);
      }
    }
    return entities.filter(this.options.typeFilterCallBack || defaultFilter);
  }

  public buildSchemaWrapperInfo(schemaWrapperInfo: SchemaWrapperInfo): void {
    for (const propertyName in schemaWrapperInfo.componentSchemaObject.properties) {
      if (
        (schemaWrapperInfo.propertySchemaObject = schemaWrapperInfo.componentSchemaObject.properties[propertyName] as SchemaObject).type && // NOSONAR
        schemaWrapperInfo.propertySchemaObject.type !== 'array'
      ) {
        schemaWrapperInfo.valueProperties.push(this.convertSchemaObjectToPropertyType(propertyName, schemaWrapperInfo));
      } else if (
        (schemaWrapperInfo.propertyReferenceObject = schemaWrapperInfo.componentSchemaObject.properties[propertyName] as ReferenceObject)
          .$ref
      ) {
        schemaWrapperInfo.referenceProperties.push(this.convertReferenceObjectToPropertyType(propertyName, schemaWrapperInfo));
      } else if (schemaWrapperInfo.propertySchemaObject.type === 'array' && schemaWrapperInfo.propertySchemaObject.items) {
        this.convertArray(propertyName, schemaWrapperInfo);
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
    return {
      required,
      name: propertyName,
      isArray: false,
      snakeCaseName: _.snakeCase(propertyName).toUpperCase(),
      typeScriptType: this.getPropertyTypeScriptType(schemaWrapperInfo),
      maxLength: schemaWrapperInfo.propertySchemaObject.maxLength,
      minLength: schemaWrapperInfo.propertySchemaObject.minLength,
      hasMultipleValidators:
        +required + +!!schemaWrapperInfo.propertySchemaObject.maxLength + +!!schemaWrapperInfo.propertySchemaObject.minLength > 1,
    };
  }

  public convertArrayObjectToValuePropertyType(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): IValueProperty {
    const required = this.getIsRequired(propertyName, schemaWrapperInfo);
    return {
      required,
      name: propertyName,
      isArray: true,
      snakeCaseName: _.snakeCase(propertyName).toUpperCase(),
      typeScriptType: this.getPropertyTypeScriptType(schemaWrapperInfo),
      hasMultipleValidators: false,
    };
  }

  public convertArrayObjectToReferencePropertyType(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): IReferenceProperty {
    return {
      ...this.convertReferenceObjectToPropertyType(propertyName, schemaWrapperInfo),
      isArray: true,
    };
  }

  public convertReferenceObjectToPropertyType(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): IReferenceProperty {
    return {
      name: propertyName,
      snakeCaseName: _.snakeCase(propertyName).toUpperCase(),
      referenceTypeName: this.parseRef(schemaWrapperInfo),
      isArray: false,
      required: (schemaWrapperInfo.componentSchemaObject.required || []).indexOf(propertyName) > -1,
    };
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
    if (!schemaWrapperInfo.propertySchemaObject.type) {
      throw new Error('Invalid Property Type');
    }
    return schemaWrapperInfo.propertySchemaObject.type;
  }

  public parseRef(schemaWrapperInfo: SchemaWrapperInfo): string {
    let regexResult: RegExpExecArray;
    let result: string | null = null;
    if (
      schemaWrapperInfo.propertyReferenceObject.$ref &&
      // tslint:disable-next-line: no-conditional-assignment
      (regexResult = this.regex.exec(schemaWrapperInfo.propertyReferenceObject.$ref) as RegExpExecArray) // NOSONAR
    ) {
      schemaWrapperInfo.propertyReferenceObject.$ref = regexResult[0];
      result = schemaWrapperInfo.propertyReferenceObject.$ref;
    }
    return result || 'unknown';
  }

  public getImportTypes(entityName: string, schemaWrapperInfo: SchemaWrapperInfo): IImportType[] {
    return schemaWrapperInfo.referenceProperties
      .map((t) => t.referenceTypeName)
      .filter((t) => t !== entityName)
      .filter((value, index, array) => array.indexOf(value) === index)
      .map((value) => ({ name: value, kebabCasedTypeName: _.kebabCase(value) }));
  }

  public getIsRequired(propertyName: string, schemaWrapperInfo: SchemaWrapperInfo): boolean {
    return (
      ((schemaWrapperInfo.componentSchemaObject.required || []).indexOf(propertyName) > -1 ||
        (schemaWrapperInfo.propertySchemaObject.nullable === undefined ? false : !schemaWrapperInfo.propertySchemaObject.nullable)) &&
      propertyName !== 'id'
    );
  }
}
