const { compilerOptions } = require('./tsconfig.json');
const path = require('path');

const basicIgnorePatterns = [
	'<rootDir>/node_modules',
	'<rootDir>/\\.cache',
	'<rootDir>/\\.vscode',
	'<rootDir>.*/public',
	'<rootDir>/cypress',
	'<rootDir>/coverage',
	'__snapshots__',
];

const testPathIgnorePatterns = [...basicIgnorePatterns, 'gatsby-types.d.ts'];

const transformIgnorePatterns = [
	...basicIgnorePatterns,
	'gatsby-types.d.ts',
	'<rootDir>/node_modules/(?!(gatsby)/)',
];

const watchPathIgnorePatterns = [...basicIgnorePatterns];

const common = {
	testPathIgnorePatterns,
	transformIgnorePatterns,
	watchPathIgnorePatterns,
};

const commonForJestTests = {
	...common,
	globals: {
		__PATH_PREFIX__: '',
	},
	prettierPath: null,
	moduleNameMapper: {
		'.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
		'.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/test/__mocks__/file-mock.js',
	},
	setupFiles: ['<rootDir>/test/loadershim.js'],
	testEnvironmentOptions: {
		url: 'http://localhost',
	},
	transform: {
		'^.+\\.[jt]sx?$': '<rootDir>/test/jest-preprocess.js',
	},
};

const commonForLintRunners = {
	...common,
	testMatch: ['<rootDir>/src/**/*'],
};

module.exports = {
	collectCoverageFrom: [
		'**/src/**/*.{js,jsx,ts,tsx}',
		'!**/__tests__/**',
		'!**/gatsby-types.d.ts/**',
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
			moduleFileExtensions: ['css'],
		},
	],
};
