import { existsSync, readdirSync, readFileSync } from 'fs';
import { generateTsModels } from '../index';

beforeAll(async () => {
  await generateTsModels('https://im-wa-cmpo-nrsr.azurewebsites.net/swagger/v1/swagger.json', './output_cmp/');
});

test('Generate TS Models should generate an output directory', async done => {
  try {
    const files = await readdirSync('./output_cmp');
    expect(files.length).toBeGreaterThan(0);
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('Generate TS Models should generate an index.ts barrel file', async done => {
  try {
    const fileExist = await existsSync('./output_cmp/index.ts');
    expect(fileExist).toBeTruthy();
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('CompetencyFormGroupFac should be correct', async done => {
  try {
    const file = await readFileSync('./output_cmp/competency.form-group-fac.ts');
    expect(file.toString()).toMatchSnapshot();
    done();
  } catch (err) {
    done.fail(err);
  }
});
