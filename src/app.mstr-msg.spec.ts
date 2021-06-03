import { mkdirSync } from 'fs';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '.';
import { ValidateFiles } from './app.spec';
import { IGeneratorOptions } from './models/generator-options';
import { IEntity } from './models/template-data';

const messageGenerationOptionsFactory = (): IGeneratorOptions => ({
  openApiJsonFileName: './open-api-spec-docs/mstr-msg.json',
  outputPath: './jest_output/msng/',
  typeFilterCallBack: (val: IEntity, i: number, arr: IEntity[]) =>
    nrsrxTypeFilterCallBack(val, i, arr) && val.name !== 'GetMessageInfoResponse',
  valuePropertyTypeFilterCallBack: nrsrxValuePropertyTypeFilterCallBack,
  genAngularFormGroups: true,
});

describe('Url Based - Full Integration Tests', () => {
  describe('MasterCorp Messaging Service', () => {
    it('should generate files', async () => {
      const options = messageGenerationOptionsFactory();
      try {
        mkdirSync(options.outputPath);
      } catch {
        // ignore
      }
      await generateTsModels(options);
      ValidateFiles(options);
    });
  });
});
