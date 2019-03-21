export interface IValidators {
  validation: {
    required?: boolean;
    minimum?: number;
    maximum?: number;
    enum?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  validatorArray: string[];
}
