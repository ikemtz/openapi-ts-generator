import { mkdirSync } from 'fs';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '..';
import { ValidateFiles } from './app.spec';
import { IGeneratorOptions } from '../models/generator-options';

const optionsFactory = (): IGeneratorOptions => ({
  openApiJsonFileName: './open-api-spec-docs/enum-test.json',
  outputPath: './jest_output/acct/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
  genAngularFormGroups: true,
});

describe('File Based - Full Integration Tests', () => {
  describe('Enums Test Service', () => {
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
