import { IGeneratorOptions } from '../models/generator-options';
import { IPath, ITemplateData } from '../models/template-data';
import { BaseGenerator } from './base-generator';
import _ = require('lodash');

export class EndPointsGenerator extends BaseGenerator<{ paths: IPath[] }> {
  public readonly GeneratorName = 'EndPointsGenerator';
  public readonly endpointIdentifierRegex = /[A-z0-9_-]*$/;
  constructor(options: IGeneratorOptions) {
    super(options, options.templates?.endpoints);
  }

  public generate(templateData: ITemplateData): string | null {
    const paths = this.eliminateDupes(templateData);
    return super.generateFile(`${this.generatorOptions.outputPath}/endpoints.ts`, { paths });
  }

  public eliminateDupes(templateData: ITemplateData): IPath[] {
    const sortedTemplateData = [...templateData.paths].sort((x, y) => (x.endpoint.toUpperCase() < y.endpoint.toUpperCase() ? -1 : 1));
    const result: IPath[] = [];
    sortedTemplateData.forEach((val) => {
      val = { ...val, tag: _.camelCase(val.tag) };
      const dupeIndex = result.findIndex((f) => f.tag === val.tag);
      if (dupeIndex > -1) {
        const dupeCount = result.filter((f) => f.tag === val.tag).length + 1;
        const endpointIdentifier = (this.endpointIdentifierRegex.exec(val.endpoint) || [])[0];
        result.push({ ...val, tag: _.camelCase(`${val.tag}_${endpointIdentifier || dupeCount}`) });
      } else {
        result.push(val);
      }
    });
    return result;
  }
}
