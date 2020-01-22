import { OpenAPIObject, SchemaObject } from 'openapi3-ts';
import { getFileName, log, readAndCompileTemplateFile, writeFileIfContentsIsChanged } from '../file-utils';
import { GeneratorOptions } from '../models/GeneratorOptions';
import { getSchemas } from './open-api-object-helper';

export class SimpleEnumGenerator {
  private readonly template: HandlebarsTemplateDelegate<any>;
  constructor(private readonly swagger: OpenAPIObject, private readonly options: GeneratorOptions) {
    this.template = readAndCompileTemplateFile(this.options.templates.simpleEnum);
  }
  public generate() {
    const enums = this.getEnums();
    let generatedEnums = 0;
    enums.forEach(data => {
      const result = this.generateEnumFile(data);
      const fileName = getFileName(data.name, this.options, true);
      const outputFileName = `${this.options.modelFolder}/${fileName}`;
      const isChanged = writeFileIfContentsIsChanged(outputFileName, result);
      if (isChanged) {
        generatedEnums++;
      }
    });
    log(`generated ${generatedEnums} enums`);
  }
  public generateEnumFile(data: { name: string; schemaObject: SchemaObject }) {
    try {
      const result = this.template(data);
      return result;
    } catch (x) {
      console.error(`Error generating SimpleEnumTemplate: ${this.options.templates.simpleEnum}.`);
      console.error(`This is likely an issue with the template.`);
      console.error(`Data: ${JSON.stringify(data)}`);
      console.error(`Goto: https://github.com/ikemtz/openapi-ts-generator to report an issue if necessary.`);
      console.error(x);
      throw x;
    }
  }
  public getEnums(): Array<{ name: string; schemaObject: SchemaObject }> {
    const schemas = getSchemas(this.swagger);
    return schemas.filter(t => t.schemaObject.enum && t.schemaObject.type !== 'integer');
  }
}
