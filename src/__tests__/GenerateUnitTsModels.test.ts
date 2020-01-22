import { existsSync, readdirSync, readFileSync } from 'fs';
import { generateTsModels } from '../index';

beforeAll(async () => {
  await generateTsModels(
    'https://d-unit-wal-00-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
    './output_unt/',
  );
});

test('Generate TS Models should generate an output directory', async done => {
  try {
    const files = await readdirSync('./output_unt');
    expect(files.length).toBeGreaterThan(0);
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('Generate TS Models should generate an output directory', async done => {
  try {
    const files = await readdirSync('./output_unt');
    expect(files.length).toBeGreaterThan(0);
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('Generate TS Models should generate an index.ts barrel file', async done => {
  try {
    const fileExist = await existsSync('./output_unt/index.ts');
    expect(fileExist).toBeTruthy();
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('IUnit should be correct', async done => {
  try {
    const file = await readFileSync('./output_unt/unit.model.ts');
    expect(file.toString()).toMatchSnapshot();
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('UnitFormGroupFac should be correct', async done => {
  try {
    const file = await readFileSync('./output_unt/unit.form-group-fac.ts');
    expect(file.toString()).toMatchSnapshot();
    done();
  } catch (err) {
    done.fail(err);
  }
});
