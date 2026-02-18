import { describe, it } from '@jest/globals';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '../index.ts';
import { createDirectory, ValidateFiles } from './app.spec.ts';
import { IGeneratorOptions } from '../models/generator-options.ts';

const fileEmployeeGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonFileName: '../src/open-api-spec-docs/nrcrn-empl.json',
  outputPath: './jest_output/empl/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
  genAngularFormGroups: true,
});

describe('File Based - Full Integration Tests', () => {
  describe('NRSRx Employee OData Microservice', () => {
    const options = fileEmployeeGenerationOptionsFactory();
    it('should generate files', async () => {
      createDirectory(options.outputPath);
      await generateTsModels(options);
      ValidateFiles(options);
    });
  });
});
