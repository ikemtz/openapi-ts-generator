/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { kebabCase } from 'lodash';
import { IGeneratorOptions } from '../models/generator-options.ts';
import { ITemplateData } from '../models/template-data.ts';
import { IEntity } from '../models/entity.ts';
import { BaseGenerator } from './base.generator.ts';

export class TestObjectFactoryGenerator extends BaseGenerator<IEntity> {
  public readonly GeneratorName = 'TestObjectFactoryGenerator';
  constructor(private readonly options: IGeneratorOptions) {
    super(options, options.templates?.testObjectFactory);
  }

  public generate(templateData: ITemplateData): void {
    templateData.entities
      ?.filter((val) => val.valueProperties?.length + val.referenceProperties?.length > 0)
      .forEach((entity) => {
        super.generateFile(`${this.options.outputPath}/${kebabCase(entity.name)}.test-obj-fac.ts`, entity);
      });
  }
}
