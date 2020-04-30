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
    const generator = new BarrelGenerator(
      setGeneratorOptionDefaults({
        templates: { barrel: './src/templates/index.ts.hbs' },
        outputPath,
      } as IGeneratorOptions),
    );
    const result = generator.generate({} as ITemplateData);
    expect(result).toMatchSnapshot();
  });
});
