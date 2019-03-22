import { IPropertyTypeMetaData } from './IPropertyTypeMetaData';

export interface ITypeMetaData {
  fileName: string;
  typeName: string;
  interfaceTypeName: string;
  namespace: string;
  fullNamespace: string;
  fullTypeName: string;
  importFile: string;
  isSubType: boolean;
  hasSubTypeProperty: boolean;
  isBaseType: boolean;
  baseType?: ITypeMetaData;
  baseImportFile?: string;
  path: string;
  pathToRoot: string;
  properties: IPropertyTypeMetaData[];
}
