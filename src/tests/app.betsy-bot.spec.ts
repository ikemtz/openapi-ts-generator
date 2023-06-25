import { mkdirSync } from 'fs';
import { generateTsModels } from '..';
import { ValidateFiles } from './app.spec';
import { IGeneratorOptions } from '../models/generator-options';

const generationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonUrl: ' https://qa.betsybot.xyz/betsyapi-qa/swagger/v1/swagger.json',
  outputPath: './jest_output/betsy-bot/',
  genAngularFormGroups: true,
});

describe('Url Based - Full Integration Tests', () => {
  describe('Sample BetsyBot Service', () => {
    it('should generate files', async () => {
      const options = generationOptionsFactory();
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
