import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        project: './tsconfig.json',
        tsconfigRootDir: './src',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
  },
  { ignores: ['node_modules/**', 'dist/**', './coverage/**', 'lib/**', 'jest_output/**', 'jest.config.mjs', 'eslint.config.mjs'] },
]);
