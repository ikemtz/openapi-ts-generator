export interface ITemplateData {
  entities?: IEntity[];
  paths: IPath[];
}
export interface IPath {
  tag: string;
  endpoint: string;
}
export interface IEntity {
  isEnum?: boolean;
  enumValues: (string | { key?: number; name: string; titleName: string })[];
  name: string;
  kebabCasedName: string;
  camelSingularName: string;
  description?: string;
  importTypes: IImportType[];
  valueProperties: IValueProperty[];
  referenceProperties: IReferenceProperty[];
}
export interface IImportType {
  kebabCasedTypeName: string;
  name: string;
  isEnum: boolean;
  areAllArrays: boolean;
  hasArrays: boolean;
  isSelfReferencing: boolean;
}
export interface IValueProperty {
  name: string;
  snakeCaseName: string;
  typeScriptType: string;
  isArray: boolean;
  hasValidators: boolean;
  hasMultipleValidators: boolean;
  required: boolean;
  maxLength?: number;
  minLength?: number;
  maximum?: number;
  minimum?: number;
  maxItems?: number;
  minItems?: number;
  description?: string;
  pattern?: string;
  initialValue: string;
  initialTestValue: string;
}

export interface IReferenceProperty {
  name: string;
  snakeCaseName: string;
  referenceTypeName: string;
  typeScriptType: string;
  hasValidators: boolean;
  isSameAsParentTypescriptType: boolean;
  hasMultipleValidators: boolean;
  maxItems?: number;
  minItems?: number;
  maxLength?: number;
  minLength?: number;
  maximum?: number;
  minimum?: number;
  isArray: boolean;
  required: boolean;
  isEnum?: boolean;
  initialValue: string;
  initialTestValue: string;
}
