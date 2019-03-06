import { readdirSync, existsSync } from 'fs';
import { generateTsModels } from '../index';

beforeAll(async () => {
  await generateTsModels('https://im-wa-cmpo-nrsr.azurewebsites.net/swagger/v1/swagger.json', './output/');
});

test('Generate TS Models should generate an output directory', async () => {
  const files = await readdirSync('./output');
  expect(files.length).toBeGreaterThan(0);
});

test('Generate TS Models should generate an index.ts barrel file', async () => {
  const fileExist = await existsSync('./output/index.ts');
  expect(fileExist).toBeTruthy();
});
