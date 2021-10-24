const { compilerOptions } = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const paths = pathsToModuleNameMapper(compilerOptions.paths, {
	prefix: '<rootDir>/',
});
const fixedPaths = {};
Object.keys(paths).forEach((key) => {
	fixedPaths[`${key.slice(0, -1)}/(.*)$`] = paths[key].concat('/$1');
});

module.exports = {
	...require('./test/jest.common'),
	collectCoverageFrom: [
		'**/src/**/*.js',
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
		'./src/shared/utils.js': {
			statements: 100,
			branches: 80,
			functions: 100,
			lines: 100,
		},
	},
	projects: [
		'./test/jest.client.js',
		'./test/jest.lint.eslint.js',
		'./test/jest.lint.tsc.js',
		'./test/jest.lint.prettier.js',
		'./test/jest.lint.stylelint.js',
	],
};
