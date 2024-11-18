import config from '@playpal/eslint/base.js';
import path from 'node:path';

export default [...config, {
	languageOptions: {
		parserOptions: {
			project: path.resolve(import.meta.dirname, 'tsconfig.json'),
			projectService: true,
			tsconfigRootDir: import.meta.dirname,
			extraFileExtensions: ['.json'],
			allowDefaultProject: true,
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
