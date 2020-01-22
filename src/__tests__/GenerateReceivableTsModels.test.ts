import { existsSync, readdirSync, readFileSync } from 'fs';
import { generateTsModels } from '../index';

beforeAll(async () => {
  await generateTsModels(
    'https://d-invr-wal-00-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
    './output_inr/',
  );
});

test('Generate TS Models should generate an output directory', async done => {
  try {
    const files = await readdirSync('./output_inr');
    expect(files.length).toBeGreaterThan(0);
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('Generate TS Models should generate an output directory', async done => {
  try {
    const files = await readdirSync('./output_inr');
    expect(files.length).toBeGreaterThan(0);
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('Generate TS Models should generate an index.ts barrel file', async done => {
  try {
    const fileExist = await existsSync('./output_inr/index.ts');
    expect(fileExist).toBeTruthy();
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('IReceivable should be correct', async done => {
  try {
    const file = await readFileSync('./output_inr/receivable.model.ts');
    expect(file.toString()).toMatchSnapshot();
    done();
  } catch (err) {
    done.fail(err);
  }
});
