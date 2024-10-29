import stylisticPlugin from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(stylisticPlugin.configs['disable-legacy'], {
  plugins: {
    '@stylistic/js': stylisticPlugin,
  },
  rules: {},
});