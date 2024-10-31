import globals from 'globals';
import tseslint from 'typescript-eslint';
import baseConfig from './config/base.js';
import typescriptConfig from './config/typescript.js';
import unicornConfig from './config/unicorn.js';
import promiseConfig from './config/promise.js';
import unusedImports from './config/unused-imports.js';
import jsonConfig from './config/json.js';
import stylisticConfig from './config/stylistic.js';
import perfectionistConfig from './config/perfectionist.js';

export default tseslint.config(
  ...jsonConfig,
  ...typescriptConfig,
  ...unicornConfig,
  ...promiseConfig,
  ...unusedImports,
  ...perfectionistConfig,
  ...baseConfig,
  ...stylisticConfig,
  {
    ignores: [
      '**/dist/',
      '**/build/',
      '**/logs/',
      'tsconfig.**',
      '**/test/',
      "**/eslint.config.**"
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        project: true,
        projectService: true,
        extraFileExtensions: ['.json'],
      },
    },

    rules: {
      '@typescript-eslint/no-invalid-this': 'off',
      '@typescript-eslint/quotes': 'off',
      'sonarjs/function-return-type': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.json'],
    ...tseslint.configs.disableTypeChecked,
  },
);