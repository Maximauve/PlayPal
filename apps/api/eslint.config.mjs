import config from '@playpal/eslint/nest.js';
import path from 'node:path';

export default [...config, {
	languageOptions: {
		parserOptions: {
			project: path.resolve(import.meta.dirname, 'tsconfig.json'),
			projectService: true,
			tsconfigRootDir: import.meta.dirname,
			extraFileExtensions: ['.json'],
		},
	},
	settings: {
		'import/resolver': {
			'node': {
				paths: [path.resolve(import.meta.dirname, 'src')],
			}
		}
	},
}];