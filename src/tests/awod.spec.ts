import { mkdirSync } from 'fs';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '..';
import { ValidateFiles } from './app.spec';
import { IGeneratorOptions } from '../models/generator-options';

const optionsFactory = (): IGeneratorOptions => ({
  openApiJsonUrl: 'https://awod-ikemtz.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './jest_output/awod-acct/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
  genAngularFormGroups: true,
});

describe('Url Based - Full Integration Tests', () => {
  describe('Adventure Works Account Service', () => {
    it('should generate files', async () => {
      const options = optionsFactory();
      try {
        mkdirSync(options.outputPath, { recursive: true });
      } catch {
        // ignore
      }
      await generateTsModels(options);
      ValidateFiles(options);
    });
  });
});
