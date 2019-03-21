import { resolve } from 'path';
import { IGeneratorOptions } from './IGeneratorOptions';

export class GeneratorOptions {
  public TEMPLATE_FOLDER = resolve(__dirname, 'templates');

  public modelFolder: string;
  public enumTSFile: string;
  public generateBarrelFiles: boolean;
  public generateClasses: boolean;
  public generateValidatorFile: boolean;
  public baseModelFileName: string;
  public subTypeFactoryFileName: string;
  public validatorsFileName: string;
  public exclude: Array<string | RegExp>;
  public enumI18NHtmlFile: string | null;
  public enumLanguageFiles: string[] | null;
  public modelModuleName: string | null;
  public enumModuleName: string | null;
  public enumRef: string | null;
  public subTypePropertyName: string;
  public namespacePrefixesToRemove: string[];
  public typeNameSuffixesToRemove: string[];
  public typesToFilter: string[];

  public templates: {
    validators: string;
    baseModel: string;
    models: string;
    subTypeFactory: string;
    barrel: string;
    enum: string;
    enumLanguage: string;
  };

  public constructor(options: IGeneratorOptions) {
    this.modelFolder = options.modelFolder;
    this.enumTSFile = options.enumTSFile;
    this.exclude = options.exclude || [];

    this.enumI18NHtmlFile = options.enumI18NHtmlFile || null;
    this.enumLanguageFiles = options.enumLanguageFiles || null;
    this.modelModuleName = options.modelModuleName || null;
    this.enumModuleName = options.enumModuleName || null;

    this.enumRef = options.enumRef || null;

    this.namespacePrefixesToRemove = options.namespacePrefixesToRemove || [];

    this.typeNameSuffixesToRemove = options.typeNameSuffixesToRemove || [];
    this.typesToFilter = options.typesToFilter || [];

    this.baseModelFileName = options.baseModelFileName || 'base-model.ts';
    this.generateBarrelFiles = options.generateBarrelFiles || true;
    this.generateClasses = options.generateClasses || true;
    this.generateValidatorFile = options.generateValidatorFile || true;
    this.subTypeFactoryFileName = options.subTypeFactoryFileName || 'sub-type-factory.ts';
    this.subTypePropertyName = options.subTypePropertyName || '$type';
    this.validatorsFileName = options.validatorsFileName || 'validators.ts';

    const template = options.templates || {};
    this.templates = {
      barrel: template.barrel || `${this.TEMPLATE_FOLDER}/generate-barrel-ts.hbs`,
      baseModel: template.baseModel || `${this.TEMPLATE_FOLDER}/generate-base-model-ts.hbs`,
      enum: template.enum || `${this.TEMPLATE_FOLDER}/generate-enum-ts.hbs`,
      enumLanguage: template.enumLanguage || `${this.TEMPLATE_FOLDER}/generate-enum-i18n-html.hbs`,
      models: template.models || `${this.TEMPLATE_FOLDER}/generate-model-ts.hbs`,
      subTypeFactory: template.subTypeFactory || `${this.TEMPLATE_FOLDER}/generate-sub-type-factory-ts.hbs`,
      validators: template.validators || `${this.TEMPLATE_FOLDER}/generate-validators-ts.hbs`,
    };
  }
}
