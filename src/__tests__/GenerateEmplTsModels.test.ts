import { existsSync, readdirSync, readFileSync } from 'fs';
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

test('Employee model should be correct', async done => {
  try {
    const file = await readFileSync('./output_emp/employee.model.ts');
    expect(file.toString()).toMatchSnapshot();
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('EmployeeFormGroupFac should be correct', async done => {
  try {
    const file = await readFileSync('./output_emp/employee.form-group-fac.ts');
    expect(file.toString()).toMatchSnapshot();
    done();
  } catch (err) {
    done.fail(err);
  }
});

test('employeeFormPatcher should be correct', async done => {
  try {
    const file = await readFileSync('./output_emp/employee.form-group-patch.ts');
    expect(file.toString()).toMatchSnapshot();
    done();
  } catch (err) {
    done.fail(err);
  }
});
