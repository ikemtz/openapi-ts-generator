import { IReferenceProperty } from './reference-property';
import { IValueProperty } from './value-property';
import { IImportType } from './template-data';

export interface IEntity {
  isEnum?: boolean;
  enumValues: (string | { key?: number; name: string; titleName: string })[];
  name: string;
  kebabCasedName: string;
  camelSingularName: string;
  description?: string;
  importTypes: IImportType[];
  valueProperties: IValueProperty[];
  referenceProperties: IReferenceProperty[];
}
