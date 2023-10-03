import { graphql } from 'gatsby';

/** Hack to get typegen for sitemap */
graphql`
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
`;

graphql`
	query rssFeedData {
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
`;

graphql`
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
`;
