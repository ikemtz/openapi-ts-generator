import { IReferenceProperty } from './reference-property';
import { IValueProperty } from './value-property';
import { IImportType } from './template-data';
import { IEnumValue } from './enum-value';

export interface IEntity {
  isEnum?: boolean;
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
