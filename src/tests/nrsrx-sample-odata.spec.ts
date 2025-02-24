import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '..';
import { createDirectory, ValidateFiles } from './app.spec';
import { IGeneratorOptions } from '../models/generator-options';

const fileSampleGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonFileName: '../src/open-api-spec-docs/nrsrx-sample-odata.json',
  outputPath: './jest_output/nrsrx-sample-odata/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
  genAngularFormGroups: true,
});

describe('File Based - Full Integration Tests', () => {
  describe('NRSRx Sample OData Microservice', () => {
    const options = fileSampleGenerationOptionsFactory();
    it('should generate files', async () => {
      createDirectory(options.outputPath);

      await generateTsModels(options);
      ValidateFiles(options);
    });
  });
});
