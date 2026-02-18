import { describe, it, expect, beforeEach } from '@jest/globals';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { IGeneratorOptions, setGeneratorOptionDefaults } from '../models/generator-options.ts';
import { MockConsoleLogger } from '../models/logger.ts';
import { BarrelGenerator } from './barrel.generator.ts';

const outputPath = './jest_output/barrel';

describe('BarrelGenerator', () => {
  beforeEach(() => {
    if (!existsSync('./jest_output')) {
      mkdirSync('./jest_output');
    }
    if (!existsSync(outputPath)) {
      mkdirSync(outputPath);
    }
  });
  it('should generate', () => {
    const options: IGeneratorOptions = {
      outputPath,
      openApiJsonUrl: '',
      logger: new MockConsoleLogger(),
    };
    const generator = new BarrelGenerator(setGeneratorOptionDefaults(options));
    const result = generator.generate();
    expect(result).toBeNull();
    rmSync(outputPath, { recursive: true });
  });

  it('should handle exceptions', () => {

    const infoLogs: string[] = [];
    const errorLogs: string[] = [];
    const warnLogs: string[] = [];

    const generator = new BarrelGenerator(
      setGeneratorOptionDefaults({
        outputPath,
        openApiJsonUrl: '',
        logger: {
          log: (x: string) => infoLogs.push(x),
          error: (x: string) => errorLogs.push(x),
          warn: (x: string) => warnLogs.push(x)
        },
      }),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (generator as any).template = () => {
      throw new Error('This error is to validate unit tests.');
    };
    generator.generate();
    expect(warnLogs).toMatchSnapshot();
  });
});
