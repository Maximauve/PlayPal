import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-object-literal-type-assertion': 'off',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
      '@typescript-eslint/prefer-interface': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-triple-slash-reference': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/quotes': ['error', 'single'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-invalid-this': ['error'],
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-shadow': [
        'error',
        {
          ignoreFunctionTypeParameterNameValueShadow: true,
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
        },
      ],
      '@typescript-eslint/await-thenable': 'off', // useful but slow
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-misused-promises': 'off', // useful but slow
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/return-await': 'error',

      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'default',
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'memberLike',
          format: null,
          filter: {
            regex: '[- ]',
            match: true,
          },
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
          filter: {
            regex: '(^\\d|[-/ ])',
            match: true,
          },
        },
        {
          selector: 'enumMember',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'property',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'method',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'memberLike',
          modifiers: ['static'],
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'memberLike',
          modifiers: ['protected'],
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],

      // Sonar handle that
      '@typescript-eslint/prefer-optional-chain': 'off',

      // Sometime we want to be verbose while typing to simplify complexity
      '@typescript-eslint/no-empty-object-type': 'off',

      '@typescript-eslint/no-floating-promises': 'off'
    },
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
  },
);