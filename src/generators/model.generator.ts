import { kebabCase } from 'lodash';
import { IGeneratorOptions } from '../models/generator-options.ts';
import { ITemplateData } from '../models/template-data.ts';
import { IEntity } from '../models/entity.ts';
import { BaseGenerator } from './base.generator.ts';

export class ModelGenerator extends BaseGenerator<IEntity> {
  public readonly GeneratorName = 'ModelGenerator';
  constructor(private readonly options: IGeneratorOptions) {
    super(options, options.genClasses ? options.templates?.entity : options.templates?.model);
  }

  public generate(templateData: ITemplateData): void {
    const fileSuffix = this.options.genClasses ? '.entity.ts' : '.model.ts';
    templateData.entities
      ?.filter((entity) => !entity.isEnum)
      .forEach((entity) => {
        super.generateFile(`${this.options.outputPath}/${kebabCase(entity.name)}${fileSuffix}`, entity);
      });
  }
}
