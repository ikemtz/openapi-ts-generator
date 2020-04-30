import { readdirSync } from 'fs';
import _ = require('lodash');
import { IGeneratorOptions } from '../models/generator-options';
import { ITemplateData } from '../models/template-data';
import { BaseGenerator } from './base-generator';

export class BarrelGenerator extends BaseGenerator<{ fileNames: string[] }> {
  private regex = /.ts$/;
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.barrel);
  }

  public generate(templateData: ITemplateData): void {
    const fileNames = readdirSync(this.generatorOptions.outputPath).map(value => value.replace(this.regex, ''));
    super.generateFile(`${this.generatorOptions.outputPath}/index.ts`, { fileNames });
  }
}
