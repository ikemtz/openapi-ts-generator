import _ = require('lodash');
import { IGeneratorOptions } from '../models/generator-options';
import { ITemplateData } from '../models/template-data';
import { IEntity } from '../models/entity';
import { BaseGenerator } from './base.generator';

export class ModelGenerator extends BaseGenerator<IEntity> {
  public readonly GeneratorName = 'ModelGenerator';
  constructor(options: IGeneratorOptions) {
    super(options, options.genClasses ? options.templates?.entity : options.templates?.model);
  }

  public generate(templateData: ITemplateData): void {
    const fileSuffix = this.generatorOptions.genClasses ? '.entity.ts' : '.model.ts';
    templateData.entities
      ?.filter((entity) => !entity.isEnum)
      .forEach((entity) => {
        super.generateFile(`${this.generatorOptions.outputPath}/${_.kebabCase(entity.name)}${fileSuffix}`, entity);
      });
  }
}
