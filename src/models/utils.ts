import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const getDirName = () => {
  const __filename = fileURLToPath(import.meta.url);
  return dirname(__filename);
};
