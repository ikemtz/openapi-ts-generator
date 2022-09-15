export interface IReferenceProperty {
  name: string;
  snakeCaseName: string;
  referenceTypeName: string;
  typeScriptType: string;
  hasValidators: boolean;
  isSameAsParentTypescriptType: boolean;
  hasMultipleValidators: boolean;
  maxItems?: number;
  minItems?: number;
  maxLength?: number;
  minLength?: number;
  maximum?: number;
  minimum?: number;
  isArray: boolean;
  required: boolean;
  isEnum?: boolean;
  initialValue: string;
  initialTestValue: string;
}
