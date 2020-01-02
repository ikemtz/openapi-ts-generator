import { ITypeMetaData } from './ITypeMetaData';
import { IValidators } from './validators';

export interface IPropertyTypeMetaData {
  name: string;
  staticFieldName: string;
  type?: ITypeMetaData;
  interfaceTypeName: string;
  typeName: string;
  namespace?: string | undefined;
  fullNamespace?: string | undefined;
  description: string | undefined;
  hasValidation: boolean;
  isComplexType: boolean;
  isImportType: boolean;
  isUniqueImportType: boolean;
  importType?: string | undefined;
  importFile?: string | undefined;
  isEnum: boolean;
  isUniqueImportEnumType: boolean;
  importEnumType?: string | undefined;
  isArray: boolean;
  isArrayComplexType: boolean;
  arrayTypeName?: string;
  validators?: IValidators | undefined;
  enum?: string[] | undefined;
}
