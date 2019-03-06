import { unlinkSync } from 'fs';
import fetch from 'node-fetch';
import { generateTSFiles } from 'swagger-ts-generator';
import { Swagger } from 'swagger-ts-generator/bootstrap/swagger';

const deleteMeFile = 'delete.me';
export async function generateTsModels(url: string, outputfolder: string) {
  const response = await fetch(url);
  const json: Swagger = await response.json();
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
