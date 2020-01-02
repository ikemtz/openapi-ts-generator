import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { compile } from 'handlebars';
import { find, fromPairs, kebabCase, sortBy, toPairs } from 'lodash';
import * as moment from 'moment';
import { SchemaObject } from 'openapi3-ts';
import { dirname, join } from 'path';
import { TypeHelpers } from './generators/type-helper';
import { GeneratorOptions } from './models/GeneratorOptions';

export const ENCODING = 'utf8';

export function readAndCompileTemplateFile(templatePath: string) {
  const templateSource = readFileSync(templatePath, ENCODING);
  const template = compile(templateSource);
  return template;
}

function readFile(outputFileName: string) {
  const file = readFileSync(outputFileName, ENCODING);
  return file;
}

function writeFile(outputFileName: string, contents: string) {
  writeFileSync(outputFileName, contents, { flag: 'w', encoding: ENCODING });
}

export function writeFileIfContentsIsChanged(outputFileName: string, contents: string) {
  let isChanged = true;
  if (existsSync(outputFileName)) {
    const oldContents = readFile(outputFileName);
    isChanged = oldContents !== contents;
  }
  if (isChanged) {
    writeFile(outputFileName, contents);
  }
  return isChanged;
}

export function ensureFile(outputFileName: string, contents: string) {
  ensureFolder(dirname(outputFileName));
  if (!existsSync(outputFileName)) {
    writeFileSync(outputFileName, contents, ENCODING);
  }
}

export function ensureFolder(folder: string) {
  if (!existsSync(folder)) {
    mkdirSync(folder);
  }
}

export function getDirectories(srcpath: string) {
  return readdirSync(srcpath).filter(file => {
    return statSync(join(srcpath, file)).isDirectory();
  });
}

export function removeFolder(folder: string) {
  if (existsSync(folder)) {
    readdirSync(folder).forEach((file, index) => {
      const curPath = folder + '/' + file;
      if (lstatSync(curPath).isDirectory()) {
        // recurse
        removeFolder(curPath);
      } else {
        // delete file
        unlinkSync(curPath);
      }
    });
    rmdirSync(folder);
  }
}

export function getPathToRoot(namespace: string) {
  let path = './';
  if (namespace) {
    path = '';
    const namespaceLength = namespace.split('.').length;
    for (let i = 0; i < namespaceLength; ++i) {
      path += '../';
    }
  }
  return path;
}

export function convertNamespaceToPath(namespace: string) {
  const parts = namespace.split('.');
  for (let index = 0; index < parts.length; index++) {
    parts[index] = kebabCase(parts[index]);
  }
  const result = parts.join('/');
  // let result = namespace.replace(/\./g, '/');
  return result;
}

export function getTypeFromDescription(description: string) {
  if (hasTypeFromDescription(description)) {
    description = description.replace('ts-type', '');
    return description.replace('type', '').trim();
  }
  return description;
}
export function hasTypeFromDescription(description: string) {
  if (description) {
    return description.startsWith('ts-type') || description.startsWith('type');
  }
  return false;
}

export function getSortedObjectProperties(object: SchemaObject | undefined) {
  if (!object) {
    return;
  }
  const pairs = sortBy(toPairs(object), 0);
  const result = fromPairs(pairs as Array<[string, {}]>);
  return result;
}

export function isInTypesToFilter(item: SchemaObject, key: string, options: GeneratorOptions) {
  if (options && options.typesToFilter) {
    const result = !!find(options.typesToFilter, element => element === key);
    // if (result) {
    //     console.log('item in typesToFilter', key, result);
    // }
    return result;
  }

  return false;
}

export function removeExtension(file: string) {
  return file.replace('.ts', '');
}

export function log(message: string) {
  const time = moment().format('HH:mm:SS');
  console.log(`[${time}] ${message}`);
}

export function getFileName(type: string, options: GeneratorOptions, fileSuffix: string) {
  const typeName = TypeHelpers.removeGenericType(TypeHelpers.getTypeName(type, options));
  return `${kebabCase(typeName)}${fileSuffix}`;
}

export function getImportFile(
  propTypeName: string | undefined,
  propNamespace: string | undefined,
  pathToRoot: string | undefined,
  suffix: string | undefined,
) {
  let importPath = `${kebabCase(propTypeName)}${suffix}`;
  if (propNamespace) {
    const namespacePath = convertNamespaceToPath(propNamespace);
    importPath = `${namespacePath}/${importPath}`;
  }

  return (pathToRoot + importPath).toLocaleLowerCase();
}
