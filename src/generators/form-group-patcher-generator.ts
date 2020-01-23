import { kebabCase, snakeCase } from 'lodash';
import { OpenAPIObject, SchemaObject } from 'openapi3-ts';
import { log, readAndCompileTemplateFile, writeFileIfContentsIsChanged } from '../file-utils';
import { GeneratorOptions } from '../models/GeneratorOptions';
import { getProperties, getSchemas } from './open-api-object-helper';
import { TypeHelpers } from './type-helper';

export class FormGroupPatcherGenerator {
  private readonly template: HandlebarsTemplateDelegate<any>;
  private readonly exclusionProperties: string[];
  constructor(private readonly swagger: OpenAPIObject, private readonly options: GeneratorOptions) {
    this.template = readAndCompileTemplateFile(this.options.templates.formGroupPatcher);
    this.exclusionProperties = options.propertiesToFilter || ['createdBy', 'createdOnUtc', 'updatedBy', 'updatedOnUtc'];
  }
  public generate() {
    const objectSchemas = this.getObjectSchemas().map(os => ({
      ...os,
      kebabName: kebabCase(os.name),
      propertyKeys: (getProperties(os.schemaObject) || [])
        .filter(t => !this.exclusionProperties.includes(t.name))
        .map(t => ({
          name: t.name,
          nameSnakeCase: snakeCase(t.name).toUpperCase(),
        })),
    }));
    let generatedPatchers = 0;
    objectSchemas.forEach(data => {
      const result = this.generatePatchFile(data);
      const fileName = this.getFileName(data.name);
      const outputFileName = `${this.options.modelFolder}/${fileName}`;
      const isChanged = writeFileIfContentsIsChanged(outputFileName, result);
      if (isChanged) {
        generatedPatchers++;
      }
    });
    log(`generated ${generatedPatchers} enums`);
  }
  public generatePatchFile(data: { name: string; schemaObject: SchemaObject }) {
    try {
      const result = this.template(data);
      return result;
    } catch (x) {
      console.error(`Error generating FormPatcherTemplate: ${this.options.templates.formGroupPatcher}.`);
      console.error(`This is likely an issue with the template.`);
      console.error(`Data: ${JSON.stringify(data)}`);
      console.error(`Goto: https://github.com/ikemtz/openapi-ts-generator to report an issue if necessary.`);
      console.error(x);
      throw x;
    }
  }
  public getObjectSchemas(): Array<{ name: string; schemaObject: SchemaObject }> {
    const schemas = getSchemas(this.swagger);
    return schemas.filter(
      t => !t.schemaObject.enum && t.schemaObject.type === 'object' && !t.name.endsWith('ODataEnvelope'),
    );
  }
  public getFileName(type: string) {
    const typeName = TypeHelpers.removeGenericType(TypeHelpers.getTypeName(type, this.options));
    return `${kebabCase(typeName)}.form-group-patch.ts`;
  }
}
