import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '..';
import { createDirectory, ValidateFiles } from './app.spec';
import { IGeneratorOptions } from '../models/generator-options';

const accountGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonUrl: 'https://petstore3.swagger.io/api/v3/openapi.json',
  outputPath: './jest_output/pet-store/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
  genAngularFormGroups: true,
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
