import { IEntity } from './template-data';

export interface IHelperContext {
  data: {
    root: IEntity;
    key: number;
    index: number;
    first: boolean;
  };
  name: string;
}

export type PropertyType = 'valueProperties' | 'referenceProperties';
