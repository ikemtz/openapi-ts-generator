type Consumers =
  | 'application/json'
  | 'text/json'
  | 'application/xml'
  | 'text/xml'
  | 'application/x-www-form-urlencoded';
type Producers = 'application/json' | 'text/json' | 'application/xml' | 'text/xml';

interface ISchema {
  $ref?: string;
  type?: string;
}

export interface ISwaggerDefinitions {
  [namespace: string]: ISwaggerDefinition;
}

export interface ISwaggerDefinitionProperties {
  [propertyName: string]: ISwaggerPropertyDefinition;
}

export interface ISwagger {
  swagger: string;
  info: {
    version: string;
    title: string;
    description: string;
  };
  host: string;
  basePath: string;
  schemes: string[];
  paths: {
    [endpointPath: string]: {
      get: ISwaggerHttpEndpoint;
      post: ISwaggerHttpEndpoint;
      put: ISwaggerHttpEndpoint;
      delete: ISwaggerHttpEndpoint;
    };
  };
  definitions: ISwaggerDefinitions;
}

export interface ISwaggerHttpEndpoint {
  tags: string[];
  summary?: string;
  operationId: string;
  consumes: Consumers[];
  produces: Producers[];
  parameters: Array<{
    name: string;
    in: 'path' | 'query' | 'body';
    required: boolean;
    description?: string;
    type?: string;
    schema?: ISchema;
    maxLength?: number;
    minLength?: number;
  }>;
  respones: {
    [httpStatusCode: string]: {
      description: string;
      schema: ISchema;
    };
  };
  deprecated: boolean;
}

export interface ISwaggerDefinition extends ISchema {
  properties: ISwaggerDefinitionProperties;
  description?: string;
  required?: Array<keyof ISwaggerDefinitionProperties>;
  allOf?: ISwaggerDefinition[];
  enum?: string[];
}

export interface ISwaggerPropertyDefinition extends ISchema {
  description?: string;
  maxLength?: number;
  minLength?: number;
  maximum?: number;
  minimum?: number;
  format?: string;
  pattern?: string;
  items?: ISwaggerDefinition;
  readonly?: boolean;
  enum?: string[];
}
