module.exports = {
	siteMetadata: {
		title: `Tory Stories`, //TODO Change title and description
		description: `Tory Stories is The Martin Hutchinson Podcast`,
		author: `Martin Hutchinson`,
	},
	plugins: [
		`gatsby-alias-imports`,
		{
			resolve: `gatsby-plugin-typescript`,
			options: {
				isTSX: true,
				allExtensions: true,
			},
		},
		{
			resolve: `gatsby-plugin-sass`,
			options: {
				postCssPlugins: [
					require('tailwindcss'),
					require('./tailwind.config.js'),
				],
			},
		},
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`,
			},
		},
		`gatsby-plugin-remove-fingerprints`,
		`gatsby-plugin-image`,
		`gatsby-plugin-sharp`,
		`gatsby-transformer-sharp`,
		// {
		// 	resolve: `gatsby-plugin-manifest`,
		// 	options: {
		// 		name: `Tory Stories`,
		// 		short_name: `Tory Stories`,
		// 		start_url: `/`,
		// 		lang: `en`,
		// 		background_color: `#260101`,
		// 		theme_color: `#260101`,
		// 		display: `minimal-ui`,
		// 		icon: `src/images/torystoriesicon.png`, // This path is relative to the root of the site.
		// 	},
		// },
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/episodes`,
				name: `episodes`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/misc`,
				name: `misc`,
			},
		},
		`gatsby-transformer-remark`,
		`gatsby-plugin-catch-links`,
		`gatsby-plugin-netlify-cms`, // should be last in the array or close to it
		{
			resolve: `gatsby-plugin-typegen`,
			options: {
				emitSchema: {
					'src/__generated__/gatsby-introspection.json': true,
					'src/__generated__/gatsby-schema.graphql': true,
				},
				emitPluginDocuments: {
					'src/__generated__/gatsby-plugin-documents.graphql': true,
				},
			},
		},
	],
};
