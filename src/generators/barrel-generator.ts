import { readdirSync } from 'fs';
import _ = require('lodash');
import { IGeneratorOptions } from '../models/generator-options';
import { ITemplateData } from '../models/template-data';
import { BaseGenerator } from './base-generator';

export class BarrelGenerator extends BaseGenerator<{ fileNames: string[] }> {
  private readonly tsRegex = /.ts$/;
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.barrel);
  }

  public generate(templateData: ITemplateData): string | null {
    const fileNames = readdirSync(this.generatorOptions.outputPath).map(value => value.replace(this.tsRegex, ''));
    return super.generateFile(`${this.generatorOptions.outputPath}/index.ts`, { fileNames });
  }
}
