const path = require('path');

module.exports = {
	rootDir: path.join(__dirname, '..'),
	displayName: 'eslint',
	runner: 'jest-runner-eslint',
	testMatch: ['<rootDir>/src/**/*'],
	watchPlugins: ['jest-runner-eslint/watch-fix'],
};
