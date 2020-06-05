import { existsSync, mkdirSync, rmdirSync, unlinkSync } from 'fs';
import { IGeneratorOptions, setGeneratorOptionDefaults } from '../models/generator-options';
import { MockConsoleLogger } from '../models/logger';
import { ITemplateData } from '../models/template-data';
import { BarrelGenerator } from './barrel-generator';

const outputPath = './jest_output';

describe('BarrelGenerator', () => {
  beforeEach(() => {
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
    const result = generator.generate({} as ITemplateData);
    expect(result).toMatchSnapshot();
    unlinkSync(`${outputPath}/index.ts`);
    rmdirSync(outputPath);
  });

  it('should handle exceptions', done => {
    const errorLogs: string[] = [];
    try {
      const generator = new BarrelGenerator(setGeneratorOptionDefaults({
        outputPath,
        openApiJsonUrl: '',
        logger: { ...new MockConsoleLogger(), error: (x) => errorLogs.push(x) }
      }));
      (generator as any).template = () => { throw new Error('This error is to validate unit tests.'); };
      generator.generate({} as ITemplateData);
      done.fail('Exception logic was not triggered.');
    }
    catch (err) {
      expect(errorLogs).toMatchSnapshot();
      done();
    }
  });
});
