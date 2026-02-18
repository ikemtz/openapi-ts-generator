import { IReferenceProperty } from './reference-property.ts';
import { IValueProperty } from './value-property.ts';
import { IImportType } from './template-data.ts';
import { IEnumValue } from './enum-value.ts';

export interface IEntity {
  isEnum?: boolean;
  isCharEnum: boolean;
  enumValues: (string | IEnumValue)[];
  name: string;
  kebabCasedName: string;
  camelSingularName: string;
  singularName: string;
  description?: string;
  importTypes: IImportType[];
  valueProperties: IValueProperty[];
  referenceProperties: IReferenceProperty[];
}
