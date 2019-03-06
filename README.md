[![Build Status](https://dev.azure.com/ikemtz/NRSRx/_apis/build/status/OData-TS-Generator?branchName=master)](https://dev.azure.com/ikemtz/NRSRx/_build/latest?definitionId=11&branchName=master)

# OData-TS-Generator
NPM package based on [swagger-ts-generator](https://www.npmjs.com/package/swagger-ts-generator) to generate typescript models for OData endpoints documented by swagger.

## Usage
```javascript
import { generateTsModels } from 'odata-ts-generator';

generateTsModels('{Your OData Swagger Enpoint here}', './{outputFolder}/');
```

## Working Example
```javascript
import { generateTsModels } from 'odata-ts-generator';

generateTsModels('https://im-wa-cmpo-nrsr.azurewebsites.net/swagger/v1/swagger.json', './models/');
```
