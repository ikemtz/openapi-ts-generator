/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { kebabCase } from 'lodash';
import { IGeneratorOptions } from '../models/generator-options';
import { ITemplateData } from '../models/template-data';
import { IEntity } from '../models/entity';
import { BaseGenerator } from './base.generator';

export class TestObjectFactoryGenerator extends BaseGenerator<IEntity> {
  public readonly GeneratorName = 'TestObjectFactoryGenerator';
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.testObjectFactory);
  }

  public generate(templateData: ITemplateData): void {
    templateData.entities
      ?.filter((val) => val.valueProperties?.length + val.referenceProperties?.length > 0)
      .forEach((entity) => {
        super.generateFile(`${this.generatorOptions.outputPath}/${kebabCase(entity.name)}.test-obj-fac.ts`, entity);
      });
  }
}
