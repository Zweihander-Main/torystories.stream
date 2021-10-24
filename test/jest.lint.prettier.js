const path = require('path');

module.exports = {
	rootDir: path.join(__dirname, '..'),
	displayName: 'prettier',
	preset: 'jest-runner-prettier',
	testPathIgnorePatterns: [
		'__generated__',
		'coverage',
		'.netlify',
		'.typings',
		'.cache',
		'.vscode',
		'public',
		'node_modules',
	],
};
