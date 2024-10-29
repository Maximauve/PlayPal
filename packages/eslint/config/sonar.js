import { fixupPluginRules } from '@eslint/compat';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';

/** @todo needs some cleaning once full eslint flat config compatibility is out */
export default tseslint.config({
  plugins: {
    sonarjs: fixupPluginRules(sonarjsPlugin),
  },
  rules: {
    ...sonarjsPlugin.configs.recommended.rules,
    'sonarjs/cognitive-complexity': 1,
    'sonarjs/no-duplicate-string': 'off',
    'sonarjs/no-identical-functions': 'off',

    // Sometime we want to be verbose on types depending others
    'sonarjs/redundant-type-aliases': 'off',

    // Already handled by Typescript
    'sonarjs/no-redeclare': 'off',

    // Not working with flat structure yet
    'sonarjs/sonar-no-fallthrough': 'off',

    // Really tooo sloooo, but really useful...
    // To be disabled with sadness and tears if it's too much to handle for our litle cpus
    // pretty intensive use of type-checking.
    // Disable in last resort
    // 'sonarjs/no-misused-promises': 'off',
  },
});