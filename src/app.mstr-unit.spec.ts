import { mkdirSync, readdirSync } from 'fs';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '.';
import { ValidateFiles } from './app.spec';
import { IGeneratorOptions } from './models/generator-options';
import { MockConsoleLogger } from './models/logger';

const unitGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonUrl: 'https://d-unit-wal-00-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './jest_output/unit/',
  typeFilterCallBack: nrsrxTypeFilterCallBack,
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
});

describe('Url Based - Full Integration Tests', () => {
  describe('MasterCorp Unit Service', () => {
    it('should generate files', async done => {
      const options = unitGenerationOptionsFactory();
      try {
        mkdirSync(options.outputPath);
      } catch {
        // ignore
      }
      await generateTsModels(options);
      const files = readdirSync(options.outputPath).sort();
      ValidateFiles(options);
      done();
    });

    it('should not generate files', async done => {
      const options = unitGenerationOptionsFactory();
      options.outputPath = './jest_output/unit_noFiles/';
      try {
        mkdirSync(options.outputPath);
      } catch {
        // ignore
      }

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
      done();
    });
  });

});
