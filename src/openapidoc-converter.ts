import _ = require('lodash');
import { OpenAPIObject, ReferenceObject, SchemaObject } from 'openapi3-ts';
import { defaultFilter, IGeneratorOptions } from './models/generator-options';
import { IEntity, IImportType, IReferenceProperty, ITemplateData, IValueProperty } from './models/template-data';

export class OpenApiDocConverter {
  public readonly regex = /[A-z0-9]*$/s;
  constructor(private readonly options: IGeneratorOptions, private readonly apiDocument: OpenAPIObject) {}

  public convertDocument(): ITemplateData {
    const entities = this.convertEntities();
    const paths: string[] = [];
    return { entities, paths };
  }

  public convertEntities(): IEntity[] {
    const entities: IEntity[] = [];

    for (const schemaName in this.apiDocument.components?.schemas) {
      if (this.apiDocument.components?.schemas[schemaName]) {
        const componentSchemaObject: SchemaObject = this.apiDocument.components?.schemas[schemaName];
        const valueProperties: IValueProperty[] = [];
        let referenceProperties: IReferenceProperty[] = [];
        let propertySchemaObject: SchemaObject;
        let propertyReferenceObject: ReferenceObject;
        for (const propertyName in componentSchemaObject.properties) {
          if (
            (propertySchemaObject = componentSchemaObject.properties[propertyName] as SchemaObject).type &&
            propertySchemaObject.type !== 'array'
          ) {
            valueProperties.push(
              this.convertSchemaObjectToPropertyType(propertyName, propertySchemaObject, componentSchemaObject),
            );
          } else if (
            (propertyReferenceObject = componentSchemaObject.properties[propertyName] as ReferenceObject).$ref
          ) {
            referenceProperties.push(
              this.convertReferenceObjectToPropertyType(propertyName, propertyReferenceObject, componentSchemaObject),
            );
          } else if (propertySchemaObject.type === 'array' && propertySchemaObject.items) {
            const arraySchemaObject = propertySchemaObject.items as SchemaObject;
            if (arraySchemaObject.type) {
              valueProperties.push(
                this.convertArrayObjectToValuePropertyType(propertyName, arraySchemaObject, componentSchemaObject),
              );
            } else {
              propertyReferenceObject = propertySchemaObject.items as ReferenceObject;
              referenceProperties.push(
                this.convertArrayObjectToReferencePropertyType(
                  propertyName,
                  propertyReferenceObject,
                  componentSchemaObject,
                ),
              );
            }
          }
        }
        referenceProperties = referenceProperties.filter(
          this.options.referencePropertyTypeFilterCallBack || defaultFilter,
        );
        const entity = {
          name: schemaName,
          referenceProperties,
          valueProperties: valueProperties.filter(this.options.valuePropertyTypeFilterCallBack || defaultFilter),
          importTypes: this.getImportTypes(referenceProperties),
        };
        entities.push(entity);
      }
    }
    return entities.filter(this.options.typeFilterCallBack || defaultFilter);
  }

  public convertSchemaObjectToPropertyType(
    propertyName: string,
    propertyObject: SchemaObject,
    componentSchemaObject: SchemaObject,
  ): IValueProperty {
    const required = this.getIsRequired(propertyName, propertyObject, componentSchemaObject);
    const property: IValueProperty = {
      name: propertyName,
      isArray: false,
      snakeCaseName: _.snakeCase(propertyName).toUpperCase(),
      typeScriptType: this.getPropertyTypeScriptType(propertyObject),
      required,
      maxLength: propertyObject.maxLength,
      minLength: propertyObject.minLength,
      hasMultipleValidators: +required + +!!propertyObject.maxLength + +!!propertyObject.minLength > 1,
    };
    return property;
  }

  public convertArrayObjectToValuePropertyType(
    propertyName: string,
    propertyObject: SchemaObject,
    componentSchemaObject: SchemaObject,
  ): IValueProperty {
    const required = this.getIsRequired(propertyName, propertyObject, componentSchemaObject);
    return {
      name: propertyName,
      isArray: true,
      snakeCaseName: _.snakeCase(propertyName).toUpperCase(),
      typeScriptType: this.getPropertyTypeScriptType(propertyObject),
      required,
      hasMultipleValidators: false,
    };
  }

  public convertArrayObjectToReferencePropertyType(
    propertyName: string,
    propertyObject: ReferenceObject,
    componentSchemaObject: SchemaObject,
  ): IReferenceProperty {
    return {
      ...this.convertReferenceObjectToPropertyType(propertyName, propertyObject, componentSchemaObject),
      isArray: true,
    };
  }

  public convertReferenceObjectToPropertyType(
    propertyName: string,
    propertyObject: ReferenceObject,
    componentSchemaObject: SchemaObject,
  ): IReferenceProperty {
    const property: IReferenceProperty = {
      name: propertyName,
      snakeCaseName: _.snakeCase(propertyName).toUpperCase(),
      referenceTypeName: this.parseRef(propertyObject.$ref),
      isArray: false,
      required: (componentSchemaObject.required || []).indexOf(propertyName) > -1,
    };
    return property;
  }

  public getPropertyTypeScriptType(propertySchemaObject: SchemaObject): string {
    if (propertySchemaObject.type === 'integer') {
      return 'number';
    } else if (propertySchemaObject.format === 'date-time') {
      return 'Date';
    }
    if (!propertySchemaObject.type) {
      throw new Error('Invalid Propety Type');
    }
    return propertySchemaObject.type;
  }
  public parseRef($ref?: string | null): string {
    let regexResult: RegExpExecArray;
    let result: string | null = null;
    // tslint:disable-next-line: no-conditional-assignment
    if ($ref && (regexResult = this.regex.exec($ref) as RegExpExecArray)) {
      result = $ref = regexResult[0];
      const importType: IImportType = { kebabCasedTypeName: _.kebabCase(result), name: result };
    }
    return result || 'unknown';
  }
  public getImportTypes(referenceProperties: IReferenceProperty[]): IImportType[] {
    return referenceProperties
      .map(t => t.referenceTypeName)
      .filter((value, index, array) => array.indexOf(value) === index)
      .map(value => ({ name: value, kebabCasedTypeName: _.kebabCase(value) }));
  }
  public getIsRequired(propertyName: string, propertyObject: SchemaObject, componentSchemaObject: SchemaObject) {
    return (
      (componentSchemaObject.required || []).indexOf(propertyName) > -1 ||
      (propertyObject.nullable === undefined ? false : !propertyObject.nullable)
    );
  }
}
