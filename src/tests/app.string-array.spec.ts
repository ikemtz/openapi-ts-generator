import { mkdirSync } from 'fs';
import { generateTsModels } from '..';
import { ValidateFiles } from './app.spec';
import { IGeneratorOptions } from '../models/generator-options';

const fileEmployeeGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonFileName: '../src/open-api-spec-docs/string-array-test-oject.json',
  outputPath: './jest_output/string-array/',
  genAngularFormGroups: true,
});

describe('File Based - Full Integration Tests', () => {
  describe('String Array Test', () => {
    const options = fileEmployeeGenerationOptionsFactory();
    it('should generate files', async () => {
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
