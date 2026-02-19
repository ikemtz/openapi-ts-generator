import { jest } from '@jest/globals';

jest.mock('./models/utils.ts', () => ({
  getDirName: jest.fn(() => './src/models/'),
}));
