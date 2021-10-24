const path = require('path');

module.exports = {
	rootDir: path.join(__dirname, '..'),
	displayName: 'tsc',
	runner: 'jest-runner-tsc',
	moduleFileExtensions: ['js', 'ts', 'tsx'],
	testMatch: ['<rootDir>/src/**/*.{ts,tsx}'],
	testPathIgnorePatterns: ['__generated__'],
};
