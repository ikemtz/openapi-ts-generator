[![Build Status](https://dev.azure.com/ikemtz/NRSRx/_apis/build/status/OData-TS-Generator?branchName=master)](https://dev.azure.com/ikemtz/NRSRx/_build/latest?definitionId=11&branchName=master) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ikemtz_OData-TS-Generator&metric=alert_status)](https://sonarcloud.io/dashboard?id=ikemtz_OData-TS-Generator) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ikemtz_OData-TS-Generator&metric=coverage)](https://sonarcloud.io/dashboard?id=ikemtz_OData-TS-Generator) [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ikemtz_OData-TS-Generator&metric=ncloc)](https://sonarcloud.io/dashboard?id=ikemtz_OData-TS-Generator) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ikemtz_OData-TS-Generator&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=ikemtz_OData-TS-Generator) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ikemtz_OData-TS-Generator&metric=security_rating)](https://sonarcloud.io/dashboard?id=ikemtz_OData-TS-Generator)
 
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
