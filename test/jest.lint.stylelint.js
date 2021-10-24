const path = require('path');

module.exports = {
	rootDir: path.join(__dirname, '..'),
	displayName: 'stylelint',
	preset: 'jest-runner-stylelint',
	testMatch: ['<rootDir>/src/**/*'],
	testPathIgnorePatterns: ['__generated__'],
};
