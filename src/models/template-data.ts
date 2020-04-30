export interface ITemplateData {
  entities?: IEntity[];
  paths: string[];
}
export interface IEntity {
  name: string;
  importTypes: IImportType[];
  valueProperties: IValueProperty[];
  referenceProperties: IReferenceProperty[];
}
export interface IImportType {
  kebabCasedTypeName: string;
  name: string;
}
export interface IValueProperty {
  name: string;
  snakeCaseName: string;
  typeScriptType?: string;
  isArray: boolean;
  hasMultipleValidators: boolean;
  required: boolean;
  maxLength?: number;
  minLength?: number;
}

export interface IReferenceProperty {
  name: string;
  snakeCaseName: string;
  referenceTypeName: string;
  isArray: boolean;
  required: boolean;
}
