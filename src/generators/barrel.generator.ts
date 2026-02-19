import { readdirSync } from 'node:fs';
import { IGeneratorOptions } from '../models/generator-options.ts';
import { BaseGenerator } from './base.generator.ts';

export class BarrelGenerator extends BaseGenerator<{ fileNames: string[]; }> {
  public readonly GeneratorName = 'BarrelGenerator';
  private readonly tsRegex = /.ts$/;
  constructor(generatorOptions: IGeneratorOptions) {
    super(generatorOptions, generatorOptions.templates?.barrel);
  }

  public generate(): string | null {
    let fileNames = readdirSync(this.generatorOptions.outputPath).map((value) => value.replace(this.tsRegex, ''));
    fileNames = fileNames.filter((x) => x !== 'endpoints');
    return super.generateFile(`${this.generatorOptions.outputPath}/index.ts`, fileNames.length ? { fileNames } : null);
  }
}
