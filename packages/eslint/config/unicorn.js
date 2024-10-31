import pluginUnicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

export default tseslint.config(pluginUnicorn.configs['flat/recommended'], {
  rules: {
    // conflicts with prettier, @see https://github.com/prettier/eslint-config-prettier/issues/51
    // and https://github.com/prettier/prettier/issues/5158
    'unicorn/number-literal-case': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-fn-reference-in-iterator': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-null': 'off',
    'unicorn/consistent-destructuring': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/empty-brace-spaces': 'off',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: { Param: true, Req: true, Res: true },
      },
    ],
    'unicorn/prefer-top-level-await': 'off',

    'unicorn/no-anonymous-default-export': 'off',

    /** Those rules does not work correctly atm */
    'unicorn/expiring-todo-comments': 'off',
  },
});