import { mkdirSync } from 'fs';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '.';
import { ValidateFiles } from './app.spec';
import { IGeneratorOptions } from './models/generator-options';
import { IEntity } from './models/template-data';

const messageGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonUrl: 'https://d-msng-wal-01-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './jest_output/msng/',
  typeFilterCallBack: (val: IEntity, i: number, arr: IEntity[]) =>
    nrsrxTypeFilterCallBack(val, i, arr) && val.name !== 'GetMessageInfoResponse',
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
});

describe('Url Based - Full Integration Tests', () => {
  describe('MasterCorp Messaging Service', () => {
    it('should generate files', async (done) => {
      const options = messageGenerationOptionsFactory();
      try {
        mkdirSync(options.outputPath);
      } catch {
        // ignore
      }
      await generateTsModels(options);
      ValidateFiles(options);
      done();
    });
  });
});
