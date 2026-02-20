import { describe, it } from '@jest/globals';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '../index.ts';
import { createDirectory, ValidateFiles } from './app.spec.ts';
import { IGeneratorOptions } from '../models/generator-options.ts';
import https from 'node:https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const optionsFactory = (): IGeneratorOptions => ({
  openApiJsonUrl: 'https://awod-ikemtz.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './jest_output/awod-acct/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
  genAngularFormGroups: true,
  genAngularFormGroupsWithDefaultValues: true,
  axiosConfig: { httpsAgent }
});

describe('Url Based - Full Integration Tests', () => {
  describe('Adventure Works Account Service', () => {
    it('should generate files', async () => {
      const options = optionsFactory();
      createDirectory(options.outputPath);

      await generateTsModels(options);
      ValidateFiles(options);
    });
  });
});
