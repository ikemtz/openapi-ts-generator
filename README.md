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