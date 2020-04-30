import { generateTsModels } from '.';

// generateTsModels('https://d-work-wal-00-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json', './output_wrk/');
// generateTsModels('https://im-wa-empo-nrsr.azurewebsites.net/swagger/v1/swagger.json', './output_emp/');
generateTsModels({
  openApiJsonUrl: 'https://d-unit-wal-00-cus-mstrcrp.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './output_unt/',
  typeFilterCallBack: (val, i, arr) => !val.name.endsWith('ODataEnvelope'),
  valuePropertyTypeFilterCallBack: (val, i, arr) => !val.name.startsWith('created') && !val.name.startsWith('updated'),
});
