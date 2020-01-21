import { existsSync, readdirSync } from 'fs';
import { generateTsModels } from '../index';

beforeAll(async () => {
  await generateTsModels('https://im-wa-empo-nrsr.azurewebsites.net/swagger/v1/swagger.json', './output_emp/');
});

test('Generate TS Models should generate an output directory', async done => {
  try {
    const files = await readdirSync('./output_emp');
    expect(files.length).toBeGreaterThan(0);
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('Generate TS Models should generate an index.ts barrel file', async done => {
  try {
    const fileExist = await existsSync('./output_emp/index.ts');
    expect(fileExist).toBeTruthy();
    done();
  } catch (err) {
    done.fail(err);
  }
});
