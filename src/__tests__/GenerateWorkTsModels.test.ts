import { existsSync, readdirSync, readFileSync } from 'fs';
import { generateTsModels } from '../index';

beforeAll(async () => {
  await generateTsModels(
    'https://d-work-wal-00-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
    './output_wrk/',
  );
});

test('Generate TS Models should generate an output directory', async done => {
  try {
    const files = await readdirSync('./output_wrk');
    expect(files.length).toBeGreaterThan(0);
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('Generate TS Models should generate an output directory', async done => {
  try {
    const files = await readdirSync('./output_wrk');
    expect(files.length).toBeGreaterThan(0);
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('Generate TS Models should generate an index.ts barrel file', async done => {
  try {
    const fileExist = await existsSync('./output_wrk/index.ts');
    expect(fileExist).toBeTruthy();
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('IAggregatedWorkModel should be correct', async done => {
  try {
    const file = await readFileSync('./output_wrk/aggregated-work-model.model.ts');
    expect(file.toString()).toMatchSnapshot();
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('AggregatedWorkModelFormGroupFac should be correct', async done => {
  try {
    const file = await readFileSync('./output_wrk/aggregated-work-model.form-group-fac.ts');
    expect(file.toString()).toMatchSnapshot();
    done();
  } catch (err) {
    done.fail(err);
  }
});
