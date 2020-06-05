import { mkdirSync } from 'fs';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '.';
import { ValidateFiles } from './app.spec';
import { IGeneratorOptions } from './models/generator-options';

const accountGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonUrl: 'https://d-acct-wal-01-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './jest_output/acct/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
});

describe('Url Based - Full Integration Tests', () => {
  describe('MasterCorp Account Service', () => {
    it('should generate files', async done => {
      const options = accountGenerationOptionsFactory();
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