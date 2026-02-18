/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { kebabCase } from 'lodash';
import { IGeneratorOptions } from '../models/generator-options.ts';
import { ITemplateData } from '../models/template-data.ts';
import { IEntity } from '../models/entity.ts';
import { BaseGenerator } from './base.generator.ts';

export class FormGenerator extends BaseGenerator<IEntity> {
  public readonly GeneratorName = 'FormGenerator';
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.form);
  }

  public generate(templateData: ITemplateData): void {
    templateData.entities
      ?.filter((val) => val.valueProperties?.length + val.referenceProperties?.length > 0)
      .forEach((entity) => {
        super.generateFile(`${this.generatorOptions.outputPath}/${kebabCase(entity.name)}.form.ts`, entity);
      });
  }
}
