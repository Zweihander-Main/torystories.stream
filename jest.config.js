const { compilerOptions } = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const path = require('path');

const paths = pathsToModuleNameMapper(compilerOptions.paths, {
	prefix: '<rootDir>/',
});
const fixedPaths = {};
Object.keys(paths).forEach((key) => {
	fixedPaths[`${key.slice(0, -1)}/(.*)$`] = paths[key].concat('/$1');
});

const testPathIgnorePatterns = [
	'node_modules',
	'\\.cache',
	'\\.typings',
	'\\.vscode',
	'\\.netlify',
	'<rootDir>.*/public',
	'cypress',
	'__generated__',
	'coverage',
];

const commonForJestTests = {
	globals: {
		__PATH_PREFIX__: '',
	},
	moduleNameMapper: {
		'.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
		'.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/test/__mocks__/file-mock.js',
		...fixedPaths,
	},
	setupFiles: ['<rootDir>/test/loadershim.js'],
	testURL: 'http://localhost',
	testPathIgnorePatterns,
	transform: {
		'^.+\\.[jt]sx?$': '<rootDir>/test/jest-preprocess.js',
	},
	transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
	watchPathIgnorePatterns: testPathIgnorePatterns,
};

const commonForLintRunners = {
	testMatch: ['<rootDir>/src/**/*'],
	testPathIgnorePatterns: ['__generated__'],
};

module.exports = {
	collectCoverageFrom: [
		'**/src/**/*.{js,jsx,ts,tsx}',
		'!**/__tests__/**',
		'!**/__server_tests__/**',
		'!**/node_modules/**',
	],
	coverageThreshold: {
		global: {
			statements: 15,
			branches: 10,
			functions: 15,
			lines: 15,
		},
	},
	watchPlugins: [
		'jest-watch-typeahead/filename',
		'jest-watch-typeahead/testname',
		'jest-watch-select-projects',
	],
	projects: [
		{
			...commonForJestTests,
			displayName: 'client',
			testEnvironment: 'jest-environment-jsdom',
		},
		{
			...commonForLintRunners,
			displayName: 'eslint',
			runner: 'jest-runner-eslint',
		},
		{
			...commonForLintRunners,
			displayName: 'prettier',
			preset: 'jest-runner-prettier',
		},
		{
			...commonForLintRunners,
			displayName: 'stylelint',
			preset: 'jest-runner-stylelint',
		},
		{
			...commonForLintRunners,
			displayName: 'tsc',
			runner: 'jest-runner-tsc',
			moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
		},
	],
};
