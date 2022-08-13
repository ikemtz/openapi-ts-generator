import * as fs from 'fs';
import { OpenAPIObject } from 'openapi3-ts';
import {
  FormGenerator,
  EndPointsGenerator,
  BarrelGenerator,
  FormGroupFactoryGenerator,
  ModelGenerator,
  ModelPropertiesGenerator,
  EnumGenerator,
  TestObjectFactoryGenerator,
} from './generators';
import { IGeneratorOptions, setGeneratorOptionDefaults } from './models/generator-options';
import { ITemplateData } from './models/template-data';
import { OpenApiDocConverter } from './openapidoc-converter';
import axios from 'axios';

export { nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from './models/nrsrx-filters';

export async function generateTsModels(options: IGeneratorOptions): Promise<void> {
  options = setGeneratorOptionDefaults(options);
  const apiDocument: OpenAPIObject = await getOpenApiDocumentAsync(options);
  const converter = new OpenApiDocConverter(options, apiDocument);
  const templateData: ITemplateData = converter.convertDocument();
  generateOutput(options, templateData);
}

async function getOpenApiDocumentAsync(options: IGeneratorOptions): Promise<OpenAPIObject> {
  let apiDoc: OpenAPIObject;
  if (options.openApiJsonUrl) {
    const response = await axios.get(options.openApiJsonUrl);
    apiDoc = response.data as OpenAPIObject;
  } else if (options.openApiJsonFileName) {
    const response = fs.readFileSync(`${__dirname}/${options.openApiJsonFileName}`);
    apiDoc = JSON.parse(response.toString()) as OpenAPIObject;
  } else {
    throw new Error(
      'You must specify either an OpenApi Json Url or FileName.  Please review the readme.md @ https://github.com/ikemtz/openapi-ts-generator.',
    );
  }
  return apiDoc;
}

function generateOutput(options: IGeneratorOptions, templateData: ITemplateData) {
  if (fs.existsSync(options.outputPath)) {
    fs.readdirSync(options.outputPath).forEach((file) => fs.unlinkSync(`${options.outputPath}/${file}`));
    fs.rmdirSync(options.outputPath);
  }
  fs.mkdirSync(options.outputPath, { recursive: true });
  const modelGenerator = new ModelGenerator(options);
  modelGenerator.generate(templateData);

  if (options.genAngularFormGroups) {
    const formGroupGenerator = new FormGroupFactoryGenerator(options);
    formGroupGenerator.generate(templateData);
    const formGenerator = new FormGenerator(options);
    formGenerator.generate(templateData);
  }

  const modelPropertiesGenerator = new ModelPropertiesGenerator(options);
  modelPropertiesGenerator.generate(templateData);
  const endpointGenerator = new EndPointsGenerator(options);
  endpointGenerator.generate(templateData);
  const barrelGenerator = new BarrelGenerator(options);
  const enumGenerator = new EnumGenerator(options);
  enumGenerator.generate(templateData);
  const testObjFacGenerator = new TestObjectFactoryGenerator(options);
  testObjFacGenerator.generate(templateData);
  barrelGenerator.generate();
}
