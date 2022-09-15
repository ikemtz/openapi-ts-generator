import _ = require('lodash');
import { IGeneratorOptions } from '../models/generator-options';
import { ITemplateData } from '../models/template-data';
import { IEntity } from '../models/entity';
import { BaseGenerator } from './base.generator';

export class ModelPropertiesGenerator extends BaseGenerator<IEntity> {
  public readonly GeneratorName = 'ModelPropertiesGenerator';
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.modelProperties);
  }

  public generate(templateData: ITemplateData): void {
    templateData.entities
      ?.filter((entity) => !entity.isEnum)
      .filter((val) => val.valueProperties?.length > 0 || val.referenceProperties?.length > 0)
      .forEach((entity) => {
        super.generateFile(`${this.generatorOptions.outputPath}/${_.kebabCase(entity.name)}.properties.ts`, entity);
      });
  }
}
