import tseslint from 'typescript-eslint';
import base from './base.js';

export default tseslint.config(
  ...base,
  {
    ignores: [
      '**/generated/'
    ],
  },
  {
    rules: {
      'unicorn/prefer-module': 'off'
    },
  },
);