import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  plugins: {
    '@stylistic': stylistic
  },
  rules: {
    '@stylistic/brace-style': "error",
    '@stylistic/curly-newline': ["error", {
      minElements: 1,
    }],
    '@stylistic/indent': ["warn", 2],
  }
});