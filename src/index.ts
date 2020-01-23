import { readFileSync, unlinkSync } from 'fs';
import { isObject } from 'lodash';
import fetch from 'node-fetch';
import { OpenAPIObject } from 'openapi3-ts';
import { resolve } from 'path';
import { ENCODING } from './file-utils';
import { FormGroupPatcherGenerator } from './generators/form-group-patcher-generator';
import { generateModelTSFiles } from './generators/model-generator';
import { SimpleEnumGenerator } from './generators/simple-enum-generator';
import { GeneratorOptions } from './models/GeneratorOptions';
import { IGeneratorOptions } from './models/IGeneratorOptions';

export async function generateTsModels(url: string, outputfolder: string) {
  const response = await fetch(url);
  const json: OpenAPIObject = await response.json();
  const oDataWrapperTypes = Object.getOwnPropertyNames(json.components?.schemas).filter(
    t => t.startsWith('ODataValue[') || t.endsWith('ODataEnvelope'),
  );
  console.log(`oDataWrapperTypes: ${oDataWrapperTypes}`);
  const TEMPLATE_FOLDER = resolve(__dirname, 'templates');
  try {
    generateTSFiles(json, {
      enumTSFile: outputfolder,
      generateClasses: false,
      generateValidatorFile: false,
      modelFolder: outputfolder,
      typesToFilter: oDataWrapperTypes,
      templateFolder: TEMPLATE_FOLDER,
    });
  } catch {
    // TODO: need to figure out why enums are failing
  }
}

function generateTSFiles(swaggerInput: string | OpenAPIObject, ioptions: IGeneratorOptions) {
  const options = new GeneratorOptions(ioptions);

  if (!swaggerInput) {
    throw new Error('swaggerFileName must be defined');
  }
  if (!isObject(options)) {
    throw new Error('options must be defined');
  }

  const swagger =
    typeof swaggerInput === 'string'
      ? (JSON.parse(readFileSync(swaggerInput, ENCODING).trim()) as OpenAPIObject)
      : swaggerInput;

  if (typeof swagger !== 'object') {
    throw new TypeError('The given swagger input is not of type object');
  }

  generateModelTSFiles(swagger, options);

  const enumGenerator = new SimpleEnumGenerator(swagger, options);
  enumGenerator.generate();

  const formGroupPatchGenerator = new FormGroupPatcherGenerator(swagger, options);
  formGroupPatchGenerator.generate();
}
