import { readdirSync } from 'fs';
import { OpenAPIObject, SchemaObject } from 'openapi3-ts';
import { readAndCompileTemplateFile, removeExtension, writeFileIfContentsIsChanged } from '../file-utils';
import { GeneratorOptions } from '../models/GeneratorOptions';

export class BarrelFileGenerator {
  private readonly template: HandlebarsTemplateDelegate<any>;

  constructor(private readonly swagger: OpenAPIObject, private readonly options: GeneratorOptions) {
    this.template = readAndCompileTemplateFile(this.options.templates.barrel);
  }

  public generate() {
    const fileNames = readdirSync(this.options.modelFolder)
      .filter(t => !t.endsWith('index.ts'))
      .map(t => removeExtension(t));
    const result = this.generateBarrelFile({ fileNames });
    const outputFileName = `${this.options.modelFolder}/index.ts`;
    writeFileIfContentsIsChanged(outputFileName, result);
  }
  public generateBarrelFile(data: { fileNames: string[] }) {
    try {
      const result = this.template(data);
      return result;
    } catch (x) {
      console.error(`Error generating BarrelFile: ${this.options.templates.barrel}.`);
      console.error(`This is likely an issue with the template.`);
      console.error(`Data: ${JSON.stringify(data)}`);
      console.error(`Goto: https://github.com/ikemtz/openapi-ts-generator to report an issue if necessary.`);
      console.error(x);
      throw x;
    }
  }
}
