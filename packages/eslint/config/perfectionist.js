import perfectionistPlugin from 'eslint-plugin-perfectionist';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  perfectionistPlugin.configs['recommended-natural'],
  {
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          ignoreCase: true,
          matcher: 'minimatch',
          internalPattern: ['~/**', '@/**'],
          newlinesBetween: 'always',
          groups: [
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          environment: 'node',
        },
      ],
      'perfectionist/sort-exports': 'error',
      'perfectionist/sort-named-exports': 'error',
      'perfectionist/sort-named-imports': 'error',
      'perfectionist/sort-array-includes': 'error',
      'perfectionist/sort-enums': 'error',

      // We want to organize by concepts
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-interfaces': [
        'error',
        {
          partitionByComment: ['section'],
          partitionByNewLine: true,
          groupKind: 'required-first',
          groups: ['top', 'unknown', 'multiline'],
          // todo: add this line when perfectionist is updated
          // groups: ['top', 'unknown', 'method', 'multiline'],
          customGroups: {
            top: ['id'],
          },
        },
      ],
      'perfectionist/sort-object-types': [
        'error',
        {
          partitionByComment: ['section'],
          partitionByNewLine: true,
          groupKind: 'required-first',
          groups: ['top', 'unknown', 'multiline'],
          // todo: add this line when perfectionist is updated
          // groups: ['top', 'unknown', 'method', 'multiline'],
          customGroups: {
            top: ['id'],
          },
        },
      ],

      // Object order may be used for style or navigation
      'perfectionist/sort-jsx-props': 'off',
      'perfectionist/sort-vue-attributes': 'off',
      'perfectionist/sort-astro-attributes': 'off',
      'perfectionist/sort-svelte-attributes': 'off',
      'perfectionist/sort-objects': 'off',

      // We want to organize by concepts
      'perfectionist/sort-intersection-types': [
        'error',
        {
          groups: [
            'import',
            'named',
            'conditional',
            'function',
            'intersection',
            'object',
            'operator',
            'union',
            'tuple',
            'keyword',
            'literal',
            'unknown',
            'nullish',
          ],
        },
      ],
      'perfectionist/sort-union-types': [
        'error',
        {
          groups: [
            'import',
            'named',
            'conditional',
            'function',
            'intersection',
            'object',
            'operator',
            'union',
            'tuple',
            'keyword',
            'literal',
            'unknown',
            'nullish',
          ],
        },
      ],

      // other rules
      'perfectionist/sort-maps': [
        'error',
        {
          partitionByComment: ['section'],
          partitionByNewLine: true,
        },
      ],
      'perfectionist/sort-sets': [
        'error',
        {
          partitionByComment: ['section'],
          partitionByNewLine: true,
        },
      ],
      'perfectionist/sort-switch-case': 'error',
      'perfectionist/sort-variable-declarations': 'error',
    },
  },
);