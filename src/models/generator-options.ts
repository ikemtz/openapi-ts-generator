/* eslint-disable @typescript-eslint/no-unused-vars */
import { resolve, } from 'node:path';
import { ILogger } from './logger.ts';
import { IEntity } from './entity.ts';
import { IReferenceProperty } from './reference-property.ts';
import { IValueProperty } from './value-property.ts';
import { AxiosRequestConfig } from 'axios';
import { getDirName } from './utils.ts';

export interface IGeneratorOptions {
  logger?: ILogger;
  outputPath: string;
  openApiJsonUrl?: string;
  openApiJsonFileName?: string;
  genAngularFormGroups?: boolean;
  genAngularFormGroupsWithDefaultValues?: boolean;
  // If set to true will generate classes instead of interfaces
  genClasses?: boolean;
  typeFilterCallBack?: (entity: IEntity, index: number, array: IEntity[]) => boolean;
  valuePropertyTypeFilterCallBack?: (valueProperty: IValueProperty, index: number, array: IValueProperty[]) => boolean;
  referencePropertyTypeFilterCallBack?: (referenceProperty: IReferenceProperty, index: number, array: IReferenceProperty[]) => boolean;
  pathUrlFormattingCallBack?: (url: string) => string;
  // This will give you the option to specify your own HandleBar templates
  templates?: ITemplates | null;
  // If specified this the AxiosRequestConfig that will be used to request the OpenApi document.
  axiosConfig?: AxiosRequestConfig<unknown>;
}
export interface ITemplates {
  // Used if genClasses is set to false (default)
  model?: string;
  // Used if genClasses is set to true
  entity?: string;
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
  const __dirname = getDirName();
  const templateFolder = resolve(`${__dirname}/..`, 'templates');
  options.typeFilterCallBack = options.typeFilterCallBack ?? defaultFilter;
  options.valuePropertyTypeFilterCallBack = options.valuePropertyTypeFilterCallBack ?? defaultFilter;
  options.referencePropertyTypeFilterCallBack = options.referencePropertyTypeFilterCallBack ?? defaultFilter;
  options.templates = {
    ...options.templates,
    model: options.templates?.model ?? `${templateFolder}/model.ts.hbs`,
    entity: options.templates?.entity ?? `${templateFolder}/entity.ts.hbs`,
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
