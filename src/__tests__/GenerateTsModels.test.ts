import { readdirSync } from 'fs';
import { generateTsModels } from '../index';

test('Generate TS Models', async () => {
  await generateTsModels('https://im-wa-cmpo-nrsr.azurewebsites.net/swagger/v1/swagger.json', './output/');
  const files = await readdirSync('./output');
  expect(files.length).toBeGreaterThan(0);
});