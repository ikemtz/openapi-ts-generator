export interface ITemplateData {
  entities?: IEntity[];
  paths: IPath[];
}
export interface IPath {
  tag: string;
  endpoint: string;
}
export interface IEntity {
  name: string;
  description?: string;
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
  maximum?: number;
  minimum?: number;
  description?: string;
  pattern?: string;
}

export interface IReferenceProperty {
  name: string;
  snakeCaseName: string;
  referenceTypeName: string;
  isArray: boolean;
  required: boolean;
}
