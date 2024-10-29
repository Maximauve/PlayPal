import json from 'eslint-plugin-json';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.json'],
  ...json.configs['recommended'],
});