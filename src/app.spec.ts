import { readdirSync, readFileSync } from 'fs';
import { generateMessageFiles, generateUnitFiles, messageGenerationOptions, unitGenerationOptions } from './app';

describe('Full Integration Tests', () => {
  describe('MasterCorp Unit Service', () => {
    it('should generate files', () => {
      generateUnitFiles();
      const files = readdirSync(unitGenerationOptions.outputPath);
      expect(files).toMatchSnapshot();
      files.forEach(file => {
        const content = readFileSync(`${unitGenerationOptions.outputPath}${file}`, 'utf8');
        expect(content).toMatchSnapshot(file);
      });
    });
  });
  describe('MasterCorp Messaging Service', () => {
    it('should generate files', () => {
      generateMessageFiles();
      const files = readdirSync(messageGenerationOptions.outputPath);
      expect(files).toMatchSnapshot();
      files.forEach(file => {
        const content = readFileSync(`${messageGenerationOptions.outputPath}${file}`, 'utf8');
        expect(content).toMatchSnapshot(file);
      });
    });
  });
});
