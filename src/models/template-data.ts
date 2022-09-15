import { IEntity } from './entity';

export interface ITemplateData {
  entities?: IEntity[];
  paths: IPath[];
}
export interface IPath {
  tag: string;
  endpoint: string;
}
export interface IImportType {
  kebabCasedTypeName: string;
  name: string;
  isEnum: boolean;
  areAllArrays: boolean;
  hasArrays: boolean;
  isSelfReferencing: boolean;
}
