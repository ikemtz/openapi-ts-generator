import { mkdirSync, readdirSync, readFileSync, rmdirSync, unlinkSync } from 'fs';
import {
  accountGenerationOptions,
  fileEmployeeGenerationOptions,
  generateAccountFiles,
  generateMessageFiles,
  generateUnitFiles,
  messageGenerationOptions,
  unitGenerationOptions,
} from './app';
import { IGeneratorOptions } from './models/generator-options';

export function ValidateFiles(options: IGeneratorOptions): void {
  const files = readdirSync(options.outputPath).sort();
  expect(files).toMatchSnapshot();
  files.forEach(file => {
    const content = readFileSync(`${options.outputPath}${file}`, 'utf8');
    expect(content).toMatchSnapshot(file);
    unlinkSync(`${options.outputPath}${file}`);
  });
  rmdirSync(options.outputPath);
}

describe('Full Integration Tests', () => {
  describe('MasterCorp Unit Service', () => {
    it('should generate files', async done => {
      try {
        mkdirSync(unitGenerationOptions.outputPath);
      } catch {
        // ignore
      }
      await generateUnitFiles();
      const files = readdirSync(unitGenerationOptions.outputPath).sort();
      ValidateFiles(unitGenerationOptions);
      done();
    });
    it('should not generate files', async done => {
      try {
        mkdirSync(unitGenerationOptions.outputPath);
      } catch {
        // ignore
      }

      await generateUnitFiles({
        ...unitGenerationOptions,
        templates: {
          formGroupFactory: '',
          model: '',
          modelProperties: '',
          barrel: '',
          enum: '',
        },
      });
      ValidateFiles(unitGenerationOptions);
      done();
    });
  });

  describe('MasterCorp Messaging Service', () => {
    it('should generate files', async done => {
      try {
        mkdirSync(messageGenerationOptions.outputPath);
      } catch {
        // ignore
      }
      await generateMessageFiles();
      ValidateFiles(messageGenerationOptions);
      done();
    });
  });

  describe('MasterCorp Account Service', () => {
    it('should generate files', async done => {
      try {
        mkdirSync(accountGenerationOptions.outputPath);
      } catch {
        // ignore
      }
      await generateAccountFiles();
      ValidateFiles(accountGenerationOptions);
      done();
    });
  });

  describe('File Based - NRSRx Employee OData Microservice', () => {
    it('should generate files', async done => {
      try {
        mkdirSync(fileEmployeeGenerationOptions.outputPath);
      } catch {
        // ignore
      }
      await generateAccountFiles();
      ValidateFiles(fileEmployeeGenerationOptions);
      done();
    });
  });
});
