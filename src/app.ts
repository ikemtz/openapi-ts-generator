import { generateTsModels } from '.';
import { IEntity, IValueProperty } from './models/template-data';

// generateTsModels('https://d-work-wal-00-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json', './output_wrk/');
// generateTsModels('https://im-wa-empo-nrsr.azurewebsites.net/swagger/v1/swagger.json', './output_emp/');
const typeFilterCallBack = (val: IEntity, i: number, arr: IEntity[]) => !val.name.endsWith('ODataEnvelope');
const valuePropertyTypeFilterCallBack = (val: IValueProperty, i: number, arr: IValueProperty[]) =>
  !val.name.startsWith('created') && !val.name.startsWith('updated');
export const unitGenerationOptions = {
  openApiJsonUrl: 'https://d-unit-wal-00-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './output_unit/',
  typeFilterCallBack,
  valuePropertyTypeFilterCallBack,
};
export const messageGenerationOptions = {
  openApiJsonUrl: 'https://d-msng-wal-01-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './output_msng/',
  typeFilterCallBack: (val: IEntity, i: number, arr: IEntity[]) =>
    typeFilterCallBack(val, i, arr) && val.name !== 'GetMessageInfoResponse',
  valuePropertyTypeFilterCallBack,
};
export function generateUnitFiles() {
  return generateTsModels(unitGenerationOptions);
}

export function generateMessageFiles() {
  return generateTsModels(messageGenerationOptions);
}

generateUnitFiles();
generateMessageFiles();
