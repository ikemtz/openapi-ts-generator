import { ITypeMetaData } from './ITypeMetaData';
import { IValidators } from './validators';

export interface IPropertyTypeMetaData {
  name: string;
  staticFieldName: string;
  type?: ITypeMetaData;
  interfaceTypeName: string;
  typeName: string;
  namespace?: string;
  fullNamespace?: string;
  description?: string;
  hasValidation: boolean;
  isComplexType: boolean;
  isImportType: boolean;
  isUniqueImportType: boolean;
  importType?: string;
  importFile?: string;
  isEnum: boolean;
  isUniqueImportEnumType: boolean;
  importEnumType?: string;
  isArray: boolean;
  isArrayComplexType: boolean;
  arrayTypeName?: string;
  validators?: IValidators;
  enum?: string[];
}
