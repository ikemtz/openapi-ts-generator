export default {
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { diagnostics: { ignoreCodes: ['TS151002'] } }],
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/jest_output/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './coverage/',
      },
    ],
  ],
  coverageReporters: ['html', 'json', 'lcov', 'text', 'clover', 'cobertura'],
  maxConcurrency: 1,
  testTimeout: 30000,
  moduleNameMapper: {},
};
