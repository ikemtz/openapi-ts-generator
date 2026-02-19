import { describe, it } from '@jest/globals';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '../index.ts';
import { createDirectory, ValidateFiles } from './app.spec.ts';
import { IGeneratorOptions } from '../models/generator-options.ts';
import https from 'node:https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const accountGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonUrl: 'https://petstore3.swagger.io/api/v3/openapi.json',
  outputPath: './jest_output/pet-store/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
  genAngularFormGroups: true,
  axiosConfig: { httpsAgent },
});

describe('Url Based - Full Integration Tests', () => {
  describe('Sample PetStore Service', () => {
    it('should generate files', async () => {
      const options = accountGenerationOptionsFactory();
      createDirectory(options.outputPath);
      await generateTsModels(options);
      ValidateFiles(options);
    });
  });
});
