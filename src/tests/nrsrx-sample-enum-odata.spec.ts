import { describe, it } from '@jest/globals';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '../index.ts';
import { createDirectory, ValidateFiles } from './app.spec.ts';
import { IGeneratorOptions } from '../models/generator-options.ts';

const fileSampleGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonFileName: '../src/open-api-spec-docs/nrsrx-sample-enum-odata.json',
  outputPath: './jest_output/nrsrx-sample-enum-odata/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
  genAngularFormGroups: false,
});

describe('File Based - Full Integration Tests', () => {
  describe('NRSRx Sample Enum OData Microservice', () => {
    const options = fileSampleGenerationOptionsFactory();
    it('should generate files', async () => {
      createDirectory(options.outputPath);
      await generateTsModels(options);
      ValidateFiles(options);
    });
  });
});
