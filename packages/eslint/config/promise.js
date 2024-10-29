import promisePlugin from 'eslint-plugin-promise';
import tseslint from 'typescript-eslint';

export default tseslint.config(promisePlugin.configs['flat/recommended']);