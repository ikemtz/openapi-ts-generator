[![Build Status](https://ikemtz.visualstudio.com/CI%20CD/_apis/build/status/openapi-ts-generator?branchName=master)](https://ikemtz.visualstudio.com/CI%20CD/_build/latest?definitionId=20&branchName=master) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=open-api-ts-generator&metric=alert_status)](https://sonarcloud.io/dashboard?id=open-api-ts-generator) [![Issues](https://img.shields.io/github/issues-raw/ikemtz/OpenApi-TS-Generator)](https://github.com/ikemtz/openapi-ts-generator/issues) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=open-api-ts-generator&metric=coverage)](https://sonarcloud.io/dashboard?id=open-api-ts-generator) [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=open-api-ts-generator&metric=ncloc)](https://sonarcloud.io/dashboard?id=open-api-ts-generator) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=open-api-ts-generator&metric=security_rating)](https://sonarcloud.io/dashboard?id=open-api-ts-generator) [![npm version](https://badge.fury.io/js/openapi-ts-generator.svg)](https://badge.fury.io/js/openapi-ts-generator)

# OpenApi-TS-Generator

NPM package based on [swagger-ts-generator](https://www.npmjs.com/package/swagger-ts-generator) to generate typescript models for endpoints documented by swagger using the relatively new [OpenAPI spec](https://swagger.io/docs/specification/about/).

## TypeScript usage with a hosted OpenApi Spec document.

```javascript
import { generateTsModels } from 'openapi-ts-generator';

generateTsModels({
  openApiJsonUrl: '{Your Swagger Enpoint URL here}',
  outputPath: './{outputFolder}/',
});
```

## TypeScript usage with an OpenApi Spec document stored on your local computer.

```javascript
import { generateTsModels } from 'openapi-ts-generator';

generateTsModels({
  openApiJsonFileName: '{location and file name of your OpenApi document}',
  outputPath: './{outputFolder}/',
});
```

## Javascript usage with a hosted OpenApi Spec document.

```javascript
const generator = require('openapi-ts-generator');

generator.generateTsModels({
  openApiJsonUrl: '{Your Swagger Enpoint URL here}',
  outputPath: './{outputFolder}/',
});
```

## Javascript usage with an OpenApi Spec document stored on your local computer.

```javascript
const generator = require('openapi-ts-generator');

generator.generateTsModels({
  openApiJsonFileName: '{location and file name of your OpenApi document}',
  outputPath: './{outputFolder}/',
});
```

## Working example with NRSRx based service

```javascript
import { generateTsModels } from 'openapi-ts-generator';

generateTsModels({
  openApiJsonUrl: 'https://im-wa-cmpo-nrsr.azurewebsites.net/swagger/v1/swagger.json',
  outputPath: './models/',
  typeFilterCallBack: (val, i, arr) => !val.name.endsWith('ODataEnvelope'),
  valuePropertyTypeFilterCallBack: (val, i, arr) => !val.name.startsWith('created') && !val.name.startsWith('updated'),
});
```
