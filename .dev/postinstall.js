const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../');
const envFile = path.resolve(root, '.env');
if (!fs.existsSync(envFile)) {
	console.info('No .env file found, copying .env.example...');
	fs.copyFileSync(path.resolve(root, '.env.example'), envFile);
}

const appsFolder = path.resolve(root, 'apps');
fs.readdirSync(appsFolder, { withFileTypes: true })
	.filter((dir) => dir.isDirectory())
	.forEach((dir) => {
		const appFolder = path.resolve(appsFolder, dir.name);
		const appEnvFile = path.resolve(appFolder, '.env');
		try {
			fs.symlinkSync(envFile, appEnvFile, 'file');
			console.info(`No .env file found in ${dir.name}, symlinked to root .env`);
		} catch (e) { }
	});