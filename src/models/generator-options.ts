import { IEntity, IReferenceProperty, IValueProperty } from './template-data';

export interface IGeneratorOptions {
  outputPath: string;
  openApiJsonUrl: string;
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
) {
  return true;
}

export function setGeneratorOptionDefaults(options: IGeneratorOptions): IGeneratorOptions {
  options.angular = options.angular ?? true;
  options.messageFormat = options.messageFormat ?? 'json';
  options.typeFilterCallBack = options.typeFilterCallBack ?? defaultFilter;
  options.valuePropertyTypeFilterCallBack = options.valuePropertyTypeFilterCallBack ?? defaultFilter;
  options.referencePropertyTypeFilterCallBack = options.referencePropertyTypeFilterCallBack ?? defaultFilter;
  options.templates = {
    ...options.templates,
    model: options.templates?.model ?? './templates/model.ts.hbs',
    formGroupFactory: options.templates?.formGroupFactory ?? './templates/form-group-factory.ts.hbs',
    barrel: options.templates?.barrel ?? './templates/index.ts.hbs',
    enum: options.templates?.barrel ?? './templates/enum.ts.hbs',
    modelProperties: options.templates?.barrel ?? './templates/model-properties.ts.hbs',
  };
  return options;
}
