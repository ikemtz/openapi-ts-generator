import { IGeneratorOptions } from '../models/generator-options';
import { IPath, ITemplateData } from '../models/template-data';
import { BaseGenerator } from './base-generator';

export class EndPointsGenerator extends BaseGenerator<{ paths: IPath[]; }> {
  public readonly GeneratorName = 'EndPointsGenerator';
  private readonly tsRegex = /.ts$/;
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.endpoints);
  }

  public generate(templateData: ITemplateData): string | null {
    return super.generateFile(`${this.generatorOptions.outputPath}/endpoints.ts`, { paths: templateData.paths });
  }
}
