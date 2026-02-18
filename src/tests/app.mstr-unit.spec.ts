import { describe, it, expect } from '@jest/globals';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '../index.ts';
import { createDirectory, ValidateFiles } from './app.spec.ts';
import { IGeneratorOptions } from '../models/generator-options.ts';
import { MockConsoleLogger } from '../models/logger.ts';
import { readdirSync } from 'node:fs';

const unitGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonFileName: './open-api-spec-docs/mstr-unit.json',
  outputPath: './jest_output/unit/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
  genAngularFormGroups: true,
});

describe('Url Based - Full Integration Tests', () => {
  describe('MasterCorp Unit Service', () => {
    it('should generate files', async () => {
      const options = unitGenerationOptionsFactory();
      createDirectory(options.outputPath);

      await generateTsModels(options);
      const files = readdirSync(options.outputPath).sort();
      ValidateFiles(options);
      expect(files).toMatchSnapshot();
    });

    it('should skip formGroup Fac files', async () => {
      const options = {
        ...unitGenerationOptionsFactory(),
        genAngularFormGroups: false,
      };
      createDirectory(options.outputPath);

      await generateTsModels(options);
      const files = readdirSync(options.outputPath).sort();
      ValidateFiles(options);
      expect(files).toMatchSnapshot();
      return;
    });
    it('should not generate files', async () => {
      const options = unitGenerationOptionsFactory();
      options.outputPath = './jest_output/unit_noFiles/';
      createDirectory(options.outputPath);

      await generateTsModels({
        ...options,
        logger: new MockConsoleLogger(),
        templates: {
          formGroupFactory: '',
          model: '',
          modelProperties: '',
          barrel: '',
          enum: '',
        },
      });
      ValidateFiles(options);
    });
  });
});
