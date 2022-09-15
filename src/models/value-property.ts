export interface IValueProperty {
  name: string;
  snakeCaseName: string;
  typeScriptType: string;
  isArray: boolean;
  hasValidators: boolean;
  hasMultipleValidators: boolean;
  required: boolean;
  maxLength?: number;
  minLength?: number;
  maximum?: number;
  minimum?: number;
  maxItems?: number;
  minItems?: number;
  email: boolean;
  uri: boolean;
  description?: string;
  pattern?: string;
  initialValue: string;
  initialTestValue: string;
}
