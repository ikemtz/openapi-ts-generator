import { readFileSync, writeFileSync } from 'fs';
import { compile } from 'handlebars';
import { IGeneratorOptions } from '../models/generator-options';

export abstract class BaseGenerator<TContextSchema> {
  public readonly template?: HandlebarsTemplateDelegate<TContextSchema>;
  public constructor(public readonly generatorOptions: IGeneratorOptions, templateFilePath: string | undefined) {
    if (templateFilePath) {
      const templateSource = readFileSync(templateFilePath, { encoding: 'utf-8' });
      this.template = compile(templateSource);
    } else {
      console.warn(`Template for ${this} has not been specified`);
    }
  }

  protected generateFile(outputFilePath: string, context: TContextSchema): string | null {
    if (this.template) {
      const content = this.template(context);
      writeFileSync(outputFilePath, content, { encoding: 'utf-8' });
      return content;
    }
    return null;
  }
}
