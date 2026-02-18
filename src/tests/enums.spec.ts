import { describe, it } from '@jest/globals';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '../index.ts';
import { createDirectory, ValidateFiles } from './app.spec.ts';
import { IGeneratorOptions } from '../models/generator-options.ts';

const optionsFactory = (): IGeneratorOptions => ({
  openApiJsonFileName: './open-api-spec-docs/enum-test.json',
  outputPath: './jest_output/enums/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
  genAngularFormGroups: true,
});

describe('File Based - Full Integration Tests', () => {
  describe('Enums Test Service', () => {
    it('should generate files', async () => {
      const options = optionsFactory();
      createDirectory(options.outputPath);

      await generateTsModels(options);
      ValidateFiles(options);
    });
  });
});
