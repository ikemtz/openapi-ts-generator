import { readFileSync, writeFileSync } from 'fs';
import { compile } from 'handlebars';
import { IGeneratorOptions } from '../models/generator-options';

export abstract class BaseGenerator<TContextSchema extends object> {
  public abstract readonly GeneratorName: string;
  public readonly template?: HandlebarsTemplateDelegate<TContextSchema>;
  public readonly emptyArrayRegex = /, ]/g;
  public constructor(
    public readonly generatorOptions: IGeneratorOptions,
    public readonly templateFilePath: string | undefined,
  ) {
    if (templateFilePath) {
      const templateSource = readFileSync(templateFilePath, { encoding: 'utf8' });
      this.template = compile(templateSource);
    }
  }

  protected generateFile(outputFilePath: string, context: TContextSchema): string | null {
    if (this.template) {
      try {
        const content = this.template(context).replace(this.emptyArrayRegex, ']');
        writeFileSync(outputFilePath, content, { encoding: 'utf8' });
        return content;
      } catch (err) {
        console.error(`Error executing template: ${this.templateFilePath}.`);
        console.error(`This is likely an issue with the template.`);
        console.error(`Data: ${JSON.stringify(context)}`);
        console.error(`Goto: https://github.com/ikemtz/openapi-ts-generator to report an issue if necessary.`);
        console.error(err);
        throw err;
      }
    } else {
      console.warn(`Template for ${this.GeneratorName} has not been specified`);
    }
    return null;
  }
}
