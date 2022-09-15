import _ = require('lodash');
import { IGeneratorOptions } from '../models/generator-options';
import { ITemplateData } from '../models/template-data';
import { IEntity } from '../models/entity';
import { BaseGenerator } from './base.generator';

export class EnumGenerator extends BaseGenerator<IEntity> {
  public readonly GeneratorName = 'EnumGenerator';
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.enum);
  }

  public generate(templateData: ITemplateData): void {
    templateData.entities
      ?.filter((entity) => entity.isEnum)
      .forEach((entity) => {
        super.generateFile(`${this.generatorOptions.outputPath}/${_.kebabCase(entity.name)}.enum.ts`, entity);
      });
  }
}
