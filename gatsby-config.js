module.exports = {
	siteMetadata: {
		title: `Tory Stories`,
		hero: `Tory Stories`,
		subHero: `The Martin Hutchinson Podcast`,
		description: `The Martin Hutchinson Podcast: The Tory achievements of 1660 - 1832, free of Whiggish prejudice!`,
		author: `Martin Hutchinson`,
		siteUrl: `https://www.torystories.stream/`,
	},
	flags: {
		DEV_SSR: true,
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
		`gatsby-plugin-postcss`,
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
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/footerMenus`,
				name: `footerMenus`,
			},
		},
		{
			resolve: `gatsby-plugin-feed`,
			options: {
				query: `
				{
					site {
					siteMetadata {
						title
						description
						siteUrl
						site_url: siteUrl
					}
					}
				}
				`,
				setup: (options) => ({
					...options,
					custom_namespaces: {
						itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
					},
					custom_elements: [
						{ 'itunes:explicit': 'no' },
						{
							'itunes:category': [
								{
									_attr: {
										text: 'Education',
									},
								},
							],
						},
						{
							'itunes:subtitle':
								'The Tory achievements of 1660 - 1832, free of Whiggish prejudice!',
						},
						{
							'itunes:summary':
								'The Martin Hutchinson Podcast: The Tory achievements of 1660 - 1832, free of Whiggish prejudice!',
						},
						{ 'itunes:author': 'Martin Hutchinson' },
						{
							'itunes:image': {
								_attr: {
									href: 'https://www.torystories.stream/images/torystories-cover.png',
								},
							},
						},
					],
				}),
				feeds: [
					{
						serialize: ({ query: { site, allMarkdownRemark } }) => {
							return allMarkdownRemark.edges.map((edge) => {
								return Object.assign(
									{},
									edge.node.frontmatter,
									{
										description:
											edge.node.frontmatter.description ||
											edge.node.excerpt,
										date: edge.node.frontmatter.date,
										url: encodeURI(
											site.siteMetadata.siteUrl +
												edge.node.fields.slug
										),
										author: 'Martin Hutchinson',
										guid: encodeURI(
											site.siteMetadata.siteUrl +
												edge.node.fields.slug
										),
										custom_elements: [
											{
												'content:encoded':
													edge.node.html,
											},
										],
									}
								);
							});
						},
						query: `
                            {
                              allMarkdownRemark(
                                sort: { order: DESC, fields: [frontmatter___date] },
					            filter: {
					            	fields: { sourceInstanceName: { eq: "episodes" } }
					            }
                              ) {
                                edges {
                                  node {
                                    excerpt(pruneLength: 160)
                                    html
                                    fields { slug }
                                    frontmatter {
                                      title
									  description
                                      date
                                    }
                                  }
                                }
                              }
                            }
                          `,
						output: '/rss.xml',
						title: 'Tory Stories: The Martin Hutchinson Podcast',
						feed_url: 'https://www.torystories.stream/rss.xml',
						site_url: 'https://www.torystories.stream/',
						image_url:
							'https://www.torystories.stream/images/torystories-cover.png',
						language: 'en',
						match: '^/episodes/',
						copyright: `${new Date().getFullYear()} Martin Hutchinson`,
					},
				],
			},
		},
		`gatsby-transformer-remark`,
		`gatsby-plugin-catch-links`,
		`gatsby-plugin-netlify-cms`, // should be last in the array or close to it
		{
			resolve: `gatsby-plugin-typegen`,
			options: {
				outputPath: `src/__generated__/gatsby-types.d.ts`,
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
