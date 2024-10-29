import config from '@playpal/eslint/base.js';

export default [...config, {
	languageOptions: {
		parserOptions: {
			project: true,
			tsconfigRootDir: import.meta.dirname,
		},
	},
}];