/* eslint-disable @typescript-eslint/no-unused-vars */
import { resolve } from 'path';
import { ILogger } from './logger';
import { IEntity } from './entity';
import { IReferenceProperty } from './reference-property';
import { IValueProperty } from './value-property';

export interface IGeneratorOptions {
  logger?: ILogger;
  outputPath: string;
  openApiJsonUrl?: string;
  openApiJsonFileName?: string;
  genAngularFormGroups?: boolean;
  typeFilterCallBack?: (entity: IEntity, index: number, array: IEntity[]) => boolean;
  valuePropertyTypeFilterCallBack?: (valueProperty: IValueProperty, index: number, array: IValueProperty[]) => boolean;
  referencePropertyTypeFilterCallBack?: (referenceProperty: IReferenceProperty, index: number, array: IReferenceProperty[]) => boolean;
  pathUrlFormattingCallBack?: (url: string) => string;
  templates?: ITemplates | null;
}
export interface ITemplates {
  model?: string;
  testObjectFactory?: string;
  form?: string;
  formGroupFactory?: string;
  modelProperties?: string;
  barrel?: string;
  enum?: string;
  endpoints?: string;
}
export function defaultFilter(
  _value: IEntity | IValueProperty | IReferenceProperty,
  _index: number,
  _array: IEntity[] | IValueProperty[] | IReferenceProperty[],
): boolean {
  return true;
}

export function setGeneratorOptionDefaults(options: IGeneratorOptions): IGeneratorOptions {
  const templateFolder = resolve(`${__dirname}/..`, 'templates');
  options.typeFilterCallBack = options.typeFilterCallBack ?? defaultFilter;
  options.valuePropertyTypeFilterCallBack = options.valuePropertyTypeFilterCallBack ?? defaultFilter;
  options.referencePropertyTypeFilterCallBack = options.referencePropertyTypeFilterCallBack ?? defaultFilter;
  options.templates = {
    ...options.templates,
    model: options.templates?.model ?? `${templateFolder}/model.ts.hbs`,
    form: options.templates?.form ?? `${templateFolder}/form.ts.hbs`,
    formGroupFactory: options.templates?.formGroupFactory ?? `${templateFolder}/form-group-factory.ts.hbs`,
    testObjectFactory: options.templates?.testObjectFactory ?? `${templateFolder}/test-object-factory.ts.hbs`,
    barrel: options.templates?.barrel ?? `${templateFolder}/index.ts.hbs`,
    enum: options.templates?.barrel ?? `${templateFolder}/enum.ts.hbs`,
    modelProperties: options.templates?.barrel ?? `${templateFolder}/model-properties.ts.hbs`,
    endpoints: options.templates?.endpoints ?? `${templateFolder}/endpoints.ts.hbs`,
  };
  return options;
}
