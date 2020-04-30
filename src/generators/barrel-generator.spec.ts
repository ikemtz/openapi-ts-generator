import { existsSync, mkdirSync } from 'fs';
import { IGeneratorOptions, setGeneratorOptionDefaults } from '../models/generator-options';
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
    };
    const generator = new BarrelGenerator(setGeneratorOptionDefaults(options));
    const result = generator.generate({} as ITemplateData);
    expect(result).toMatchSnapshot();
  });
});
