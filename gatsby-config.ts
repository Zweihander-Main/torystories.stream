import type { GatsbyConfig } from 'gatsby';

const TITLE = 'Tory Stories',
	SUBTITLE = 'The Martin Hutchinson Podcast',
	DESCRIPTION =
		'The Tory achievements of 1660 - 1832, free of Whiggish prejudice!',
	AUTHOR = 'Martin Hutchinson',
	EMAIL = 'itunes@tbwns.com',
	LANG = 'en',
	SITE_URL = 'https://www.torystories.stream/',
	FEED_FILENAME = 'rss.xml',
	IMAGE_ICON_RELATIVE_LOC = 'src/images/torystories-icon.png',
	IMAGE_COVER_URL = `${SITE_URL}images/torystories-cover.jpg`,
	IMAGE_COVER_SMALL_URL = `${SITE_URL}images/torystories-cover-144.png`,
	COLOR_BG = '#372248',
	COLOR_THEME = `${COLOR_BG}`,
	ITUNES_EXPLICIT = 'no',
	ITUNES_TYPE = 'episodic',
	ITUNES_CATEGORY_ARRAY = [
		{
			_attr: {
				text: 'History',
			},
		},
	];

const config: GatsbyConfig = {
	siteMetadata: {
		title: TITLE,
		subtitle: SUBTITLE,
		description: `${SUBTITLE}: ${DESCRIPTION}`,
		author: AUTHOR,
		siteUrl: SITE_URL,
		feedUrl: `${SITE_URL}${FEED_FILENAME}`,
	},
	flags: {
		DEV_SSR: true,
	},
	trailingSlash: 'ignore',
	graphqlTypegen: {
		typesOutputPath: 'src/gatsby-types.d.ts',
		generateOnBuild: true,
		documentSearchPaths: [
			'./gatsby-node.ts',
			'./plugins/**/gatsby-node.ts',
			'./src/utils/queries.ts',
		],
	},
	plugins: [
		{
			resolve: 'gatsby-plugin-typescript',
			options: {
				isTSX: true,
				allExtensions: true,
			},
		},
		'gatsby-plugin-postcss',
		'gatsby-plugin-react-helmet',
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'images',
				path: `${__dirname}/src/images`,
			},
		},
		'gatsby-plugin-remove-fingerprints',
		'gatsby-plugin-image',
		'gatsby-plugin-sharp',
		'gatsby-transformer-sharp',
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				name: `${TITLE}: ${SUBTITLE}`,
				short_name: `${TITLE}`,
				description: `${SUBTITLE}: ${DESCRIPTION}`,
				start_url: '/',
				lang: `${LANG}`,
				background_color: `${COLOR_BG}`,
				theme_color: `${COLOR_THEME}`,
				display: 'standalone',
				icon: `${IMAGE_ICON_RELATIVE_LOC}`, // This path is relative to the root of the site.
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: `${__dirname}/content/episodes`,
				name: 'episodes',
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: `${__dirname}/content/misc`,
				name: 'misc',
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: `${__dirname}/content/footerMenus`,
				name: 'footerMenus',
			},
		},
		{
			resolve: 'gatsby-plugin-feed',
			options: {
				/* NOTE: types generated from repeated code in src/utils/queries.ts */
				query: `
					query rssFeedSiteData {
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
				setup: (options: Record<string, unknown>) => ({
					...options,
					custom_namespaces: {
						itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
					},
					custom_elements: [
						{ 'itunes:explicit': `${ITUNES_EXPLICIT}` },
						{ 'itunes:type': `${ITUNES_TYPE}` },
						{
							'itunes:category': ITUNES_CATEGORY_ARRAY,
						},
						{
							'itunes:subtitle': `${DESCRIPTION}`,
						},
						{
							'itunes:summary': `${SUBTITLE}: ${DESCRIPTION}`,
						},
						{ 'itunes:author': `${AUTHOR}` },
						{
							'itunes:owner': [
								{ 'itunes:name': `${AUTHOR}` },
								{ 'itunes:email': `${EMAIL}` },
							],
						},
						{
							'itunes:image': {
								_attr: {
									href: `${IMAGE_COVER_URL}`,
								},
							},
						},
					],
				}),
				feeds: [
					{
						serialize: ({
							query: { site, allMarkdownRemark },
						}: {
							query: {
								site: Queries.rssFeedSiteDataQuery['site'];
								allMarkdownRemark: Queries.rssFeedDataQuery['allMarkdownRemark'];
							};
						}) => {
							return allMarkdownRemark.edges.map((edge) => {
								const desc =
									edge.node?.frontmatter?.description ||
									edge.node.excerpt;
								return Object.assign(
									{},
									edge.node.frontmatter,
									{
										description: desc,
										date: edge.node.frontmatter?.date,
										url: encodeURI(
											(site?.siteMetadata?.siteUrl ||
												'') + edge.node.fields?.slug
										),
										author:
											site?.siteMetadata?.author || '',
										guid: encodeURI(
											(site?.siteMetadata?.siteUrl ||
												'') + edge.node.fields?.slug
										),
										enclosure: {
											url: encodeURI(
												(site?.siteMetadata?.siteUrl ||
													'') +
													edge.node.frontmatter
														?.audioFile?.publicURL
											),
											size: edge.node.frontmatter
												?.audioFile?.size,
											type: edge.node.frontmatter
												?.audioFile?.internal.mediaType,
										},
										custom_elements: [
											{
												'content:encoded':
													edge.node.html,
											},
											{
												'itunes:author':
													site?.siteMetadata
														?.author || '',
											},
											{
												'itunes:episode':
													edge.node.frontmatter
														?.episodeNum,
											},
											{
												'itunes:image': {
													_attr: {
														href: encodeURI(
															(site?.siteMetadata
																?.siteUrl ||
																'') +
																edge.node
																	?.frontmatter
																	?.featuredImage
																	?.childImageSharp
																	?.gatsbyImageData
																	?.images
																	?.fallback
																	?.src
														),
													},
												},
											},
											{
												'itunes:duration':
													edge.node?.frontmatter
														?.audioFile?.fields
														?.durationString,
											},
										],
									}
								);
							});
						},
						/* NOTE: types generated from repeated code in src/utils/queries.ts */
						query: `
							query rssFeedData{
								allMarkdownRemark(
									sort: { frontmatter: { date: DESC } }
									filter: { fields: { sourceInstanceName: { eq: "episodes" } } }
								) {
									edges {
										node {
											excerpt(pruneLength: 160)
											html
											fields {
												slug
											}
											frontmatter {
												title
												description
												date
												episodeNum
												featuredImage {
													childImageSharp {
														gatsbyImageData(
															layout: FIXED
															width: 1500
															pngOptions: { quality: 50 }
															jpgOptions: { quality: 50 }
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
						output: `/${FEED_FILENAME}`,
						title: `${TITLE}: ${SUBTITLE}`,
						description: `${DESCRIPTION}`,
						feed_url: `${SITE_URL}${FEED_FILENAME}`,
						site_url: `${SITE_URL}`,
						image_url: `${IMAGE_COVER_SMALL_URL}`,
						language: `${LANG}`,
						match: '^/episodes/',
						copyright: `${new Date().getFullYear()} ${AUTHOR}`,
					},
				],
			},
		},
		'gatsby-transformer-remark',
		'gatsby-plugin-catch-links',
		{
			resolve: 'gatsby-plugin-sitemap',
			options: {
				/* NOTE: types generated from repeated code in src/utils/queries.ts */
				query: `
					query sitemapInConfig {
						allSitePage {
							nodes {
								component
								path
							}
						}
						site {
							siteMetadata {
								siteUrl
							}
						}
						allMarkdownRemark(
							filter: { fields: { sourceInstanceName: { eq: "episodes" } } }
						) {
							edges {
								node {
									frontmatter {
										featuredImage {
											mtime
										}
									}
									fields {
										slug
									}
								}
							}
						}
					}
				`,
				resolvePages: (queryData: Queries.sitemapInConfigQuery) => {
					/* Logic: Featured image modified time should be last time
					an episode was modified. For all other pages, use the
					current time. */
					const allPages = queryData.allSitePage.nodes;
					const allEpNodes = queryData.allMarkdownRemark.edges;
					const epNodeMap = allEpNodes.reduce(
						(acc, { node }) => {
							const { slug } = node.fields as { slug: string };
							const { featuredImage } = node.frontmatter as {
								featuredImage: { readonly mtime: string };
							};
							acc[slug] = featuredImage;
							return acc;
						},
						{} as Record<string, { readonly mtime: string }>
					);
					const curTime = new Date().toISOString();
					return allPages.map((page) => {
						if (epNodeMap[page.path]) {
							return { ...page, ...epNodeMap[page.path] };
						}
						return { ...page, mtime: curTime };
					});
				},
				serialize: ({
					path,
					mtime,
				}: {
					path: string;
					mtime: string;
				}) => {
					return {
						url: path,
						lastmod: mtime,
					};
				},
			},
		},
		'gatsby-plugin-netlify-cms', // should be last in the array or close to it
	],
};

export default config;
