import { generateTsModels } from '.';
import { IGeneratorOptions } from './models/generator-options';
import { nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from './models/nrsrx-filters';
import { IEntity } from './models/template-data';

export const unitGenerationOptions = {
  openApiJsonUrl: 'https://d-unit-wal-00-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './output_unit/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
};
export const messageGenerationOptions = {
  openApiJsonUrl: 'https://d-msng-wal-01-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './output_msng/',
  typeFilterCallBack: (val: IEntity, i: number, arr: IEntity[]) =>
    nrsrxTypeFilterCallBack(val, i, arr) && val.name !== 'GetMessageInfoResponse',
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
};
export const accountGenerationOptions = {
  openApiJsonUrl: 'https://d-acct-wal-01-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './output_acct/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
};
export function generateUnitFiles(options: IGeneratorOptions = unitGenerationOptions) {
  return generateTsModels(options);
}

export function generateMessageFiles(options: IGeneratorOptions = messageGenerationOptions) {
  return generateTsModels(messageGenerationOptions);
}

export function generateAccountFiles(options: IGeneratorOptions = messageGenerationOptions) {
  return generateTsModels(accountGenerationOptions);
}

generateUnitFiles();
generateMessageFiles();
generateAccountFiles();
