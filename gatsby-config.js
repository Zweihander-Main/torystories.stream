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
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Tory Stories: The Martin Hutchinson Podcast`,
				short_name: `Tory Stories`,
				description: `The Martin Hutchinson Podcast: The Tory achievements of 1660 - 1832, free of Whiggish prejudice!`,
				start_url: `/`,
				lang: `en`,
				background_color: `#372248`,
				theme_color: `#372248`,
				display: `standalone`,
				icon: `src/images/torystories-icon.png`, // This path is relative to the root of the site.
			},
		},
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
						author
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
							'itunes:owner': [
								{ 'itunes:name': 'Martin Hutchinson' },
								{ 'itunes:email': 'itunes@tbwns.com' },
							],
						},
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
								const desc =
									edge.node.frontmatter.description ||
									edge.node.excerpt;
								return Object.assign(
									{},
									edge.node.frontmatter,
									{
										description: desc,
										date: edge.node.frontmatter.date,
										url: encodeURI(
											site.siteMetadata.siteUrl +
												edge.node.fields.slug
										),
										author: site.siteMetadata.author,
										guid: encodeURI(
											site.siteMetadata.siteUrl +
												edge.node.fields.slug
										),
										enclosure: {
											url: encodeURI(
												site.siteMetadata.siteUrl +
													edge.node.frontmatter
														.audioFile.publicURL
											),
											size: edge.node.frontmatter
												.audioFile.size,
											type: edge.node.frontmatter
												.audioFile.internal.mediaType,
										},
										custom_elements: [
											{
												'content:encoded':
													edge.node.html,
											},
											{
												'itunes:author':
													site.siteMetadata.author,
											},
											{
												'itunes:subtitle': desc,
											},
											{
												'itunes:image': {
													_attr: {
														href: encodeURI(
															site.siteMetadata
																.siteUrl +
																edge.node
																	.frontmatter
																	.featuredImage
																	.childImageSharp
																	.fallback
																	.src
														),
													},
												},
											},
											{
												'itunes:duration':
													edge.node.frontmatter
														.audioFile.fields
														.durationString,
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
									  featuredImage {
										childImageSharp {
											gatsbyImageData(
												layout: FIXED
												width: 1500
												pngOptions: {quality: 50}
												jpgOptions: {quality: 50}
											)
										}
									  }
									  audioFile {
										publicURL
										size
										fields {
										  durationString
										}
										internal {
										  mediaType
										}
									  }
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
							'https://www.torystories.stream/images/torystories-cover-144.png',
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
