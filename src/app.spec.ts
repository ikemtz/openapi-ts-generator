import { mkdirSync, readdirSync, readFileSync, rmdirSync, unlinkSync } from 'fs';
import { generateMessageFiles, generateUnitFiles, messageGenerationOptions, unitGenerationOptions } from './app';

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
      expect(files).toMatchSnapshot();
      files.forEach(file => {
        const content = readFileSync(`${unitGenerationOptions.outputPath}${file}`, 'utf8');
        expect(content).toMatchSnapshot(file);
      });
      readdirSync(unitGenerationOptions.outputPath).forEach(file =>
        unlinkSync(`${unitGenerationOptions.outputPath}${file}`),
      );
      rmdirSync(unitGenerationOptions.outputPath);
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
      const files = readdirSync(messageGenerationOptions.outputPath).sort();
      expect(files).toMatchSnapshot();
      files.forEach(file => {
        const content = readFileSync(`${messageGenerationOptions.outputPath}${file}`, 'utf8');
        expect(content).toMatchSnapshot(file);
      });
      readdirSync(messageGenerationOptions.outputPath).forEach(file =>
        unlinkSync(`${messageGenerationOptions.outputPath}${file}`),
      );
      rmdirSync(messageGenerationOptions.outputPath);
      done();
    });
  });
});
