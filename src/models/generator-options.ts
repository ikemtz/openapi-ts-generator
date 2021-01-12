/* eslint-disable @typescript-eslint/no-unused-vars */
import { resolve } from 'path';
import { ILogger } from './logger';
import { IEntity, IReferenceProperty, IValueProperty } from './template-data';

export interface IGeneratorOptions {
  logger?: ILogger;
  outputPath: string;
  openApiJsonUrl?: string;
  openApiJsonFileName?: string;
  messageFormat?: string | null;
  angular?: boolean | null;
  typeFilterCallBack?: (entity: IEntity, index: number, array: IEntity[]) => boolean;
  valuePropertyTypeFilterCallBack?: (valueProperty: IValueProperty, index: number, array: IValueProperty[]) => boolean;
  referencePropertyTypeFilterCallBack?: (
    referenceProperty: IReferenceProperty,
    index: number,
    array: IReferenceProperty[],
  ) => boolean;
  templates?: ITemplates | null;
}
export interface ITemplates {
  model: string;
  formGroupFactory: string;
  modelProperties: string;
  barrel: string;
  enum: string;
}
export function defaultFilter(
  value: IEntity | IValueProperty | IReferenceProperty,
  index: number,
  array: IEntity[] | IValueProperty[] | IReferenceProperty[],
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
    formGroupFactory: options.templates?.formGroupFactory ?? `${templateFolder}/form-group-factory.ts.hbs`,
    barrel: options.templates?.barrel ?? `${templateFolder}/index.ts.hbs`,
    enum: options.templates?.barrel ?? `${templateFolder}/enum.ts.hbs`,
    modelProperties: options.templates?.barrel ?? `${templateFolder}/model-properties.ts.hbs`,
  };
  return options;
}
