module.exports = {
	client: {
		name: 'torystories.stream',
		tagName: 'graphql',
		includes: [
			'./src/**/*.{ts,tsx}',
			'./src/__generated__/gatsby-plugin-documents.graphql',
		],
		service: {
			name: 'GatsbyJS',
			localSchemaFile: './src/__generated__/gatsby-schema.graphql',
		},
	},
};
