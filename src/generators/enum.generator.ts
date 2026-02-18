import { kebabCase } from 'lodash';
import { IGeneratorOptions } from '../models/generator-options.ts';
import { ITemplateData } from '../models/template-data.ts';
import { IEntity } from '../models/entity.ts';
import { BaseGenerator } from './base.generator.ts';

export class EnumGenerator extends BaseGenerator<IEntity> {
  public readonly GeneratorName = 'EnumGenerator';
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.enum);
  }

  public generate(templateData: ITemplateData): void {
    templateData.entities
      ?.filter((entity) => entity.isEnum)
      .forEach((entity) => {
        super.generateFile(`${this.generatorOptions.outputPath}/${kebabCase(entity.name)}.enum.ts`, entity);
      });
  }
}
