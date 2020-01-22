export interface IGeneratorOptions {
  generateSubTypeFactory?: boolean;
  modelFolder: string;
  enumTSFile: string;
  templateFolder: string;
  generateBaseClass?: boolean;
  generateBarrelFiles?: boolean;
  generateClasses?: boolean;
  generateValidatorFile?: boolean;
  baseModelFileName?: string;
  subTypeFactoryFileName?: string;
  validatorsFileName?: string;
  exclude?: Array<string | RegExp>;
  enumI18NHtmlFile?: string;
  enumLanguageFiles?: string[];
  modelModuleName?: string;
  enumModuleName?: string;
  enumRef?: string;
  subTypePropertyName?: string;
  namespacePrefixesToRemove?: string[];
  typeNameSuffixesToRemove?: string[];
  typesToFilter?: string[];
  propertiesToFilter?: string[];
  sortModelProperties?: boolean;
  sortEnumTypes?: boolean;

  templates?: {
    validators?: string;
    baseModel?: string;
    models?: string;
    subTypeFactory?: string;
    formGroupFacTemplate?: string;
    barrel?: string;
    enum?: string;
    enumLanguage?: string;
    simpleEnum?: string;
  };
}
