import { describe, it } from '@jest/globals';
import { generateTsModels, nrsrxTypeFilterCallBack, nrsrxValuePropertyTypeFilterCallBack } from '../index.ts';
import { createDirectory, ValidateFiles } from './app.spec.ts';
import { IGeneratorOptions } from '../models/generator-options.ts';
import { IEntity } from '../models/entity.ts';

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
      createDirectory(options.outputPath);

      await generateTsModels(options);
      ValidateFiles(options);
    });
  });
});
