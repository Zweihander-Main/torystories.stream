const path = require('path');

module.exports = {
	rootDir: path.join(__dirname, '..'),
	displayName: 'prettier',
	preset: 'jest-runner-prettier',
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
};
