import { existsSync, mkdirSync, rmdirSync, unlinkSync } from 'fs';
import { IGeneratorOptions, setGeneratorOptionDefaults } from '../models/generator-options';
import { MockConsoleLogger } from '../models/logger';
import { BarrelGenerator } from './barrel-generator';

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
    expect(result).toMatchSnapshot();
    unlinkSync(`${outputPath}/index.ts`);
    rmdirSync(outputPath);
  });

  it('should handle exceptions', (done) => {
    const errorLogs: string[] = [];
    try {
      const generator = new BarrelGenerator(
        setGeneratorOptionDefaults({
          outputPath,
          openApiJsonUrl: '',
          logger: { ...new MockConsoleLogger(), error: (x) => errorLogs.push(x) },
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (generator as any).template = () => {
        throw new Error('This error is to validate unit tests.');
      };
      generator.generate();
      done.fail('Exception logic was not triggered.');
    } catch (err) {
      const firstMessage = errorLogs.shift();
      expect(firstMessage?.startsWith('Error executing template: ')).toBe(true);
      done();
    }
  });
});
