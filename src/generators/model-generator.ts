import _ = require('lodash');
import { IGeneratorOptions } from '../models/generator-options';
import { IEntity, ITemplateData } from '../models/template-data';
import { BaseGenerator } from './base-generator';

export class ModelGenerator extends BaseGenerator<IEntity> {
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.model);
  }

  public generate(templateData: ITemplateData): void {
    templateData.entities?.forEach(entity => {
      super.generateFile(`${this.generatorOptions.outputPath}/${_.kebabCase(entity.name)}.ts`, entity);
    });
  }
}
