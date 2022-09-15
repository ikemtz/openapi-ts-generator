import _ = require('lodash');
import { IGeneratorOptions } from '../models/generator-options';
import { ITemplateData } from '../models/template-data';
import { IEntity } from '../models/entity';
import { BaseGenerator } from './base.generator';

export class FormGenerator extends BaseGenerator<IEntity> {
  public readonly GeneratorName = 'FormGenerator';
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.form);
  }

  public generate(templateData: ITemplateData): void {
    templateData.entities
      ?.filter((val) => val.valueProperties?.length + val.referenceProperties?.length > 0)
      .forEach((entity) => {
        super.generateFile(`${this.generatorOptions.outputPath}/${_.kebabCase(entity.name)}.form.ts`, entity);
      });
  }
}
