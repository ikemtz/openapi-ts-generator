[![Build Status](https://ikemtz.visualstudio.com/CI%20CD/_apis/build/status/openapi-ts-generator?branchName=master)](https://ikemtz.visualstudio.com/CI%20CD/_build/latest?definitionId=20&branchName=master) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=open-api-ts-generator&metric=alert_status)](https://sonarcloud.io/dashboard?id=open-api-ts-generator) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=open-api-ts-generator&metric=coverage)](https://sonarcloud.io/dashboard?id=open-api-ts-generator) [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=open-api-ts-generator&metric=ncloc)](https://sonarcloud.io/dashboard?id=open-api-ts-generator) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=open-api-ts-generator&metric=security_rating)](https://sonarcloud.io/dashboard?id=open-api-ts-generator) [![npm version](https://badge.fury.io/js/openapi-ts-generator.svg)](https://badge.fury.io/js/openapi-ts-generator)
 
# OpenApi-TS-Generator
NPM package based on [swagger-ts-generator](https://www.npmjs.com/package/swagger-ts-generator) to generate typescript models for endpoints documented by swagger using the relatively new [OpenAPI spec](https://swagger.io/docs/specification/about/).

## TypeScript Usage
```javascript
import { generateTsModels } from 'openapi-ts-generator';

generateTsModels('{Your OData Swagger Enpoint here}', './{outputFolder}/');
```

## Javascript Usage
```javascript
const generator = require('openapi-ts-generator');

generator.generateTsModels('{Your OData Swagger Enpoint here}', './{outputFolder}/');
```

## Working Example
```javascript
import { generateTsModels } from 'openapi-ts-generator';

generateTsModels('https://im-wa-cmpo-nrsr.azurewebsites.net/swagger/v1/swagger.json', './models/');
```
