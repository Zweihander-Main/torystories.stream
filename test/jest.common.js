// common project configuration used by the other configs
const path = require('path');
const rootDir = path.join(__dirname, '..');
const { compilerOptions } = require(`${rootDir}/tsconfig.json`);
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const paths = pathsToModuleNameMapper(compilerOptions.paths, {
	prefix: '<rootDir>/',
});
const fixedPaths = {};
Object.keys(paths).forEach((key) => {
	fixedPaths[`${key.slice(0, -1)}/(.*)$`] = paths[key].concat('/$1');
});

module.exports = {
	rootDir,
	transform: {
		'^.+\\.[jt]sx?$': `<rootDir>/test/jest-preprocess.js`,
	},
	moduleNameMapper: {
		'.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
		'.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/test/__mocks__/file-mock.js`,
		...fixedPaths,
	},
	testPathIgnorePatterns: [
		`node_modules`,
		`\\.cache`,
		`\\.typings`,
		`\\.vscode`,
		'\\.netlify',
		`<rootDir>.*/public`,
		`cypress`,
		`__generated__`,
		'coverage',
	],
	transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
	globals: {
		__PATH_PREFIX__: ``,
	},
	testURL: `http://localhost`,
	setupFiles: [`<rootDir>/test/loadershim.js`],
	watchPlugins: [
		'jest-watch-typeahead/filename',
		'jest-watch-typeahead/testname',
		'jest-watch-select-projects',
	],
};
