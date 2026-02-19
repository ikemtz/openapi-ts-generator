/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import lodash from 'lodash';
import { IGeneratorOptions } from '../models/generator-options.ts';
import { ITemplateData } from '../models/template-data.ts';
import { IEntity } from '../models/entity.ts';
import { BaseGenerator } from './base.generator.ts';

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
        super.generateFile(`${this.generatorOptions.outputPath}/${lodash.kebabCase(entity.name)}.properties.ts`, entity);
      });
  }
}
