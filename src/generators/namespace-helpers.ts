import { GeneratorOptions } from '../models/GeneratorOptions';
import { ITypeMetaData } from '../models/ITypeMetaData';
import { INamespaceGroups } from '../models/NamespaceGroups';
import { TypeHelpers } from './type-helper';

export const ROOT_NAMESPACE = 'root';
export class NameSpaceHelpers {
  public static getNamespace(type: string, options: GeneratorOptions, removePrefix: boolean) {
    let typeName = removePrefix ? TypeHelpers.getTypeNameWithoutNamespacePrefixesToRemove(type, options) : type;

    if (TypeHelpers.getIsGenericType(typeName)) {
      const first = typeName.substring(0, typeName.indexOf('['));
      typeName = first + first.substring(typeName.indexOf(']'));
    }
    const parts = typeName.split('.');
    parts.pop();
    return parts.join('.');
  }

  public static getNamespaceGroups(typeCollection: ITypeMetaData[], options: GeneratorOptions) {
    const namespaces: INamespaceGroups = {
      [ROOT_NAMESPACE]: [],
    };
    for (const type of typeCollection) {
      const namespace = type.namespace || ROOT_NAMESPACE;
      if (NameSpaceHelpers.excludeNamespace(namespace, options.exclude)) {
        continue;
      }

      if (!namespaces[namespace]) {
        namespaces[namespace] = [];
      }
      namespaces[namespace].push(type);
    }
    return namespaces;
  }

  public static excludeNamespace(namespace: string, excludeOptions: Array<string | RegExp>) {
    if (!excludeOptions || !excludeOptions.length) {
      return false;
    }

    for (const excludeCheck of excludeOptions) {
      if (
        (excludeCheck instanceof RegExp && excludeCheck.test(namespace)) ||
        namespace.indexOf(excludeCheck as string) > -1
      ) {
        return true;
      }
    }
    return false;
  }
}
