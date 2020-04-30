import _ = require('lodash');
import { IGeneratorOptions } from '../models/generator-options';
import { IEntity, ITemplateData } from '../models/template-data';
import { BaseGenerator } from './base-generator';

export class FormGroupGenerator extends BaseGenerator<IEntity> {
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.formGroupFactory);
  }

  public generate(templateData: ITemplateData): void {
    templateData.entities
      ?.filter(val => val.valueProperties?.length + val.referenceProperties?.length > 0)
      .forEach(entity => {
        super.generateFile(`${this.generatorOptions.outputPath}/${_.kebabCase(entity.name)}.form-group-fac.ts`, entity);
      });
  }
}
