import { readdirSync } from 'fs';
import { IGeneratorOptions } from '../models/generator-options';
import { BaseGenerator } from './base-generator';

export class BarrelGenerator extends BaseGenerator<{ fileNames: string[]; }> {
  public readonly GeneratorName = 'BarrelGenerator';
  private readonly tsRegex = /.ts$/;
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.barrel);
  }

  public generate(): string | null {
    let fileNames = readdirSync(this.generatorOptions.outputPath).map((value) => value.replace(this.tsRegex, ''));
    fileNames = fileNames.filter(x => x !== 'endpoints');
    return super.generateFile(`${this.generatorOptions.outputPath}/index.ts`, { fileNames });
  }
}
