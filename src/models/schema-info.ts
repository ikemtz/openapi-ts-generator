import { ReferenceObject, SchemaObject } from 'openapi3-ts/dist/oas30';
import { IEnumValue } from './enum-value';
import { defaultFilter, IGeneratorOptions } from './generator-options';
import { IReferenceProperty } from './reference-property';
import { IValueProperty } from './value-property';

export class SchemaWrapperInfo {
  public propertySchemaObject: SchemaObject = {};
  public propertyReferenceObject: ReferenceObject = { $ref: '' };
  public isEnum?: boolean;

  public readonly enumValues: (string | IEnumValue)[];

  public readonly componentSchemaObject: SchemaObject;
  public readonly valueProperties: IValueProperty[];
  public referenceProperties: IReferenceProperty[];
  public readonly description?: string;

  constructor(schemaItem: SchemaObject) {
    this.componentSchemaObject = schemaItem;
    this.description = schemaItem.description;
    this.valueProperties = [];
    this.referenceProperties = [];
    this.enumValues = [];
  }

  public updateReferenceProperties(options: IGeneratorOptions): void {
    this.referenceProperties = this.referenceProperties.filter(options.referencePropertyTypeFilterCallBack ?? defaultFilter);
  }
}
