import * as fs from 'fs';
import fetch from 'node-fetch';
import { OpenAPIObject } from 'openapi3-ts';
import { BarrelGenerator, FormGroupGenerator, ModelGenerator, ModelPropertiesGenerator } from './generators';
import { IGeneratorOptions, setGeneratorOptionDefaults } from './models/generator-options';
import { ITemplateData } from './models/template-data';
import { OpenApiDocConverter } from './openapidoc-converter';

export async function generateTsModels(options: IGeneratorOptions) {
  options = setGeneratorOptionDefaults(options);
  const apiDocument: OpenAPIObject = await getOpenApiDocumentAsync(options);
  const converter = new OpenApiDocConverter(options, apiDocument);
  const templateData: ITemplateData = converter.convertDocument();
  generateOutput(options, templateData);
}

async function getOpenApiDocumentAsync(options: IGeneratorOptions): Promise<OpenAPIObject> {
  const response = await fetch(options.openApiJsonUrl);
  const apiDoc = await response.json();
  return apiDoc as OpenAPIObject;
}

function generateOutput(options: IGeneratorOptions, templateData: ITemplateData) {
  if (fs.existsSync(options.outputPath)) {
    fs.readdirSync(options.outputPath).forEach(file => fs.unlinkSync(`${options.outputPath}/${file}`));
    fs.rmdirSync(options.outputPath);
  }
  fs.mkdirSync(options.outputPath);
  const modelGenerator = new ModelGenerator(options);
  modelGenerator.generate(templateData);
  const formGroupGenerator = new FormGroupGenerator(options);
  formGroupGenerator.generate(templateData);
  const modelPropertiesGenerator = new ModelPropertiesGenerator(options);
  modelPropertiesGenerator.generate(templateData);
  const barrelGenerator = new BarrelGenerator(options);
  barrelGenerator.generate(templateData);
}
