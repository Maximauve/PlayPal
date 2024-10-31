import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(js.configs.recommended, {
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
  rules: {
    'no-await-in-loop': 1,
    'prefer-const': 'error',
    'no-mixed-operators': 'off',
    'no-console': 'off',
    'no-inner-declarations': 'off',
    'no-dupe-class-members': 'off',
    'no-useless-escape': 'off',
    'no-redeclare': 'off',
    quote: 'off',
    'no-return-await': 'error',
    'no-array-constructor': 'error',
    'no-unused-labels': 'error',
    'no-caller': 'error',
    'no-new-wrappers': 'error',
    'no-invalid-this': 'off',
    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    'no-var': 'error',
    'no-void': [
      'warn',
      {
        allowAsStatement: true,
      },
    ],
    eqeqeq: ['error', 'smart'],
    camelcase: 'off',
    semi: ['warn', 'always'],
    curly: ['error', 'all'],
    'object-curly-spacing': ['warn', 'always'],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['./*'],
            message: 'relative import is not allowed. Use absolute imports with @/'
          },
          {
            group: ['../*'],
            message: 'relative import is not allowed. Use absolute imports with @/'
          }
        ],
      },
    ],

    // Handled by perfectionist
    'sort-imports': 'off',
  },
});