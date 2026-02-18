import { describe, it } from '@jest/globals';
import { generateTsModels } from '../index.ts';
import { createDirectory, ValidateFiles } from './app.spec.ts';
import { IGeneratorOptions } from '../models/generator-options.ts';

const fileEmployeeGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonFileName: '../src/open-api-spec-docs/string-array-test-oject.json',
  outputPath: './jest_output/string-array/',
  genAngularFormGroups: true,
});

describe('File Based - Full Integration Tests', () => {
  describe('String Array Test', () => {
    const options = fileEmployeeGenerationOptionsFactory();
    it('should generate files', async () => {
      createDirectory(options.outputPath);

      await generateTsModels(options);
      ValidateFiles(options);
    });
  });
});
