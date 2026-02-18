import { ReferenceObject, SchemaObject } from 'openapi3-ts/oas31';
import { IEnumValue } from './enum-value.ts';
import { defaultFilter, IGeneratorOptions } from './generator-options.ts';
import { IReferenceProperty } from './reference-property.ts';
import { IValueProperty } from './value-property.ts';

export class SchemaWrapperInfo {
  public propertySchemaObject: SchemaObject = {};
  public propertyReferenceObject: ReferenceObject = { $ref: '' };
  public isEnum?: boolean;
  public isCharEnum?: boolean = false;

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
