import { generateTsModels } from '.';
import { IGeneratorOptions } from './models/generator-options';
import { NrsrxOptions } from './models/nrsrx-options';
import { IEntity } from './models/template-data';

export const unitGenerationOptions = {
  openApiJsonUrl: 'https://d-unit-wal-00-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './output_unit/',
  typeFilterCallBack: NrsrxOptions.typeFilterCallBack,
  valuePropertyTypeFilterCallBack: NrsrxOptions.valuePropertyTypeFilterCallBack,
};
export const messageGenerationOptions = {
  openApiJsonUrl: 'https://d-msng-wal-01-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './output_msng/',
  typeFilterCallBack: (val: IEntity, i: number, arr: IEntity[]) =>
    NrsrxOptions.typeFilterCallBack(val, i, arr) && val.name !== 'GetMessageInfoResponse',
  valuePropertyTypeFilterCallBack: NrsrxOptions.valuePropertyTypeFilterCallBack,
};
export function generateUnitFiles(options: IGeneratorOptions = unitGenerationOptions) {
  return generateTsModels(options);
}

export function generateMessageFiles(options: IGeneratorOptions = messageGenerationOptions) {
  return generateTsModels(messageGenerationOptions);
}

generateUnitFiles();
generateMessageFiles();
