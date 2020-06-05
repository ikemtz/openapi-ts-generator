import { mkdirSync } from 'fs';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '.';
import { ValidateFiles } from './app.spec';
import { IGeneratorOptions } from './models/generator-options';

const fileEmployeeGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonFileName: '../src/test-swagger-document.json',
  outputPath: './jest_output/empl/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
});

describe('File Based - Full Integration Tests', () => {
  describe('NRSRx Employee OData Microservice', () => {
    const options = fileEmployeeGenerationOptionsFactory();
    it('should generate files', async done => {
      try {
        mkdirSync(options.outputPath);
      } catch {
        // ignore
      }
      await generateTsModels(options);
      ValidateFiles(options);
      done();
    });
  });
});
