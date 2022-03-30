import _ = require('lodash');
import { IGeneratorOptions } from '../models/generator-options';
import { IEntity, ITemplateData, IValueProperty } from '../models/template-data';
import { BaseGenerator } from './base-generator';
import * as HandleBars from 'handlebars';

export class FormGroupGenerator extends BaseGenerator<IEntity> {
  public readonly GeneratorName = 'FormGroupGenerator';
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
    HandleBars.registerHelper(
      'minimumValidator',
      (
        x: 'valueProperties' | 'referenceProperties',
        y: {
          data: {
            root: IEntity;
            key: number;
            index: number;
            first: boolean;
          };
          name: string;
        },
      ) => this.validatorFactory(x, y, 'minimum', 'min'),
    );
    HandleBars.registerHelper(
      'maximumValidator',
      (
        x: 'valueProperties' | 'referenceProperties',
        y: {
          data: {
            root: IEntity;
            key: number;
            index: number;
            first: boolean;
          };
          name: string;
        },
      ) => this.validatorFactory(x, y, 'maximum', 'max'),
    );
    HandleBars.registerHelper(
      'minLengthValidator',
      (
        x: 'valueProperties' | 'referenceProperties',
        y: {
          data: {
            root: IEntity;
            key: number;
            index: number;
            first: boolean;
          };
          name: string;
        },
      ) => this.validatorFactory(x, y, 'minLength', 'minLength'),
    );
    HandleBars.registerHelper(
      'maxLengthValidator',
      (
        x: 'valueProperties' | 'referenceProperties',
        y: {
          data: {
            root: IEntity;
            key: number;
            index: number;
            first: boolean;
          };
          name: string;
        },
      ) => this.validatorFactory(x, y, 'maxLength', 'maxLength'),
    );
    HandleBars.registerHelper(
      'patternValidator',
      (
        x: 'valueProperties' | 'referenceProperties',
        y: {
          data: {
            root: IEntity;
            key: number;
            index: number;
            first: boolean;
          };
          name: string;
        },
      ) => this.validatorFactory(x, y, 'pattern', 'pattern'),
    );
  }

  public validatorFactory(
    propertyCollection: 'valueProperties' | 'referenceProperties',
    propertyContext: {
      data: {
        root: IEntity;
        key: number;
        index: number;
        first: boolean;
      };
      name: string;
    },
    validationName: string,
    angularValidatorFunctionName: string,
  ) {
    const props = propertyContext.data.root[propertyCollection] as IValueProperty[];
    const prop = props[propertyContext.data.index];
    let value = prop[validationName as keyof typeof prop] as number | string | undefined;
    if (value !== undefined && value !== null) {
      const hasMultipleValidators = prop.hasMultipleValidators;
      value = typeof value === 'string' ? `'${value}'` : value;
      return `${!hasMultipleValidators ? ', ' : ''}Validators.${angularValidatorFunctionName}(${value})${
        hasMultipleValidators ? ', ' : ''
      }`;
    }
  }
}
