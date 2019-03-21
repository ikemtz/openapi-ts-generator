import { readFileSync, unlinkSync } from 'fs';
import { isObject } from 'lodash';
import fetch from 'node-fetch';
import { ENCODING } from './file-utils';
import { generateModelTSFiles } from './generators/model-generator';
import { GeneratorOptions } from './models/GeneratorOptions';
import { IGeneratorOptions } from './models/IGeneratorOptions';
import { ISwagger } from './models/swagger';

const deleteMeFile = 'delete.me';
export async function generateTsModels(url: string, outputfolder: string) {
  const response = await fetch(url);
  const json: ISwagger = await response.json();
  const oDataWrapperTypes = Object.getOwnPropertyNames(json.definitions).filter(t => t.startsWith('ODataValue['));

  const filePath = `${outputfolder}/${deleteMeFile}`;
  try {
    generateTSFiles(json, {
      enumTSFile: outputfolder,
      generateClasses: false,
      generateValidatorFile: false,
      modelFolder: outputfolder,
      subTypeFactoryFileName: deleteMeFile,
      typesToFilter: oDataWrapperTypes,
    });
  } catch {
    // TODO: need to figure out why enums are failing
  }
  unlinkSync(filePath);
}

function generateTSFiles(swaggerInput: string | ISwagger, ioptions: IGeneratorOptions) {
  const options = new GeneratorOptions(ioptions);

  if (!swaggerInput) {
    throw new Error('swaggerFileName must be defined');
  }
  if (!isObject(options)) {
    throw new Error('options must be defined');
  }

  const swagger =
    typeof swaggerInput === 'string'
      ? (JSON.parse(readFileSync(swaggerInput, ENCODING).trim()) as ISwagger)
      : swaggerInput;

  if (typeof swagger !== 'object') {
    throw new TypeError('The given swagger input is not of type object');
  }

  // let folder = path.normalize(options.modelFolder);
  // utils.removeFolder(folder);

  generateModelTSFiles(swagger, options);
}
