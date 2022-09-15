import _ = require('lodash');
import { IGeneratorOptions } from '../models/generator-options';
import { ITemplateData } from '../models/template-data';
import { IEntity } from '../models/entity';
import { IValueProperty } from '../models/value-property';
import { BaseGenerator } from './base.generator';
import * as HandleBars from 'handlebars';
import { IHelperContext, PropertyType } from '../models/helper-context';

export class FormGroupFactoryGenerator extends BaseGenerator<IEntity> {
  public readonly GeneratorName = 'FormGroupFactoryGenerator';
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.formGroupFactory);
  }

  public generate(templateData: ITemplateData): void {
    this.registerHelpers();
    templateData.entities
      ?.filter((val) => val.valueProperties?.length + val.referenceProperties?.length > 0)
      .forEach((entity) => {
        super.generateFile(`${this.generatorOptions.outputPath}/${_.kebabCase(entity.name)}.form-group-fac.ts`, entity);
      });
  }
  public registerHelpers() {
    this.registerValidatorHelper('minimum', 'min');
    this.registerValidatorHelper('maximum', 'max');
    this.registerValidatorHelper('minLength');
    this.registerValidatorHelper('maxLength');
    this.registerValidatorHelper('maxItems', 'maxLength');
    this.registerValidatorHelper('minItems', 'minLength');
    this.registerValidatorHelper('pattern');
  }

  public registerValidatorHelper(validatorName: string, angularValidatorName: string = validatorName): void {
    HandleBars.registerHelper(`${validatorName}Validator`, (x: PropertyType, y: IHelperContext) =>
      this.validatorFactory(x, y, validatorName, angularValidatorName),
    );
  }

  public validatorFactory(
    propertyCollection: PropertyType,
    propertyContext: IHelperContext,
    validationName: string,
    angularValidatorFunctionName: string,
  ) {
    const props = propertyContext.data.root[propertyCollection] as IValueProperty[];
    const prop = props[propertyContext.data.index];
    let value = prop[validationName as keyof typeof prop] as number | string | undefined;
    if (value !== undefined && value !== null) {
      const hasMultipleValidators = prop.hasMultipleValidators;
      value = typeof value === 'string' ? `'${value}'` : value;
      return `Validators.${angularValidatorFunctionName}(${value})${hasMultipleValidators ? ', ' : ''}`;
    }
    return '';
  }
}
