import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

type SEOProps = {
	description?: string;
	lang?: string;
	meta?: Array<
		| {
				name: string;
				content: string;
				property?: undefined;
		  }
		| {
				property: string;
				content: string;
				name?: undefined;
		  }
	>;
	title?: string;
};

const SEO: React.FC<SEOProps> = ({
	description = '',
	lang = 'en',
	meta = [],
	title = '',
}) => {
	const { site } = useStaticQuery<GatsbyTypes.SEOSiteMetadataQuery>(
		graphql`
			query SEOSiteMetadata {
				site {
					siteMetadata {
						title
						subtitle
						description
						author
						feedUrl
					}
				}
			}
		`
	);

	if (
		!(
			site &&
			site?.siteMetadata &&
			site.siteMetadata.title &&
			site.siteMetadata.subtitle &&
			site.siteMetadata.description &&
			site.siteMetadata.author &&
			site.siteMetadata.feedUrl
		)
	) {
		throw new Error('Some part of SEO required site metadata is missing.');
	}

	const metaDescription = description || site.siteMetadata.description;

	const homeTitle = `${site.siteMetadata.title}: ${site.siteMetadata.subtitle}`;

	return (
		<Helmet
			htmlAttributes={{
				lang,
			}}
			title={title !== '' ? title : undefined}
			titleTemplate={`%s | ${site.siteMetadata.title}`}
			defaultTitle={homeTitle}
			meta={[
				{
					name: 'description',
					content: metaDescription,
				},
				{
					property: 'og:title',
					content: title !== '' ? title : homeTitle,
				},
				{
					property: 'og:description',
					content: metaDescription,
				},
				{
					property: 'og:type',
					content: 'website',
				},
				{
					name: 'twitter:card',
					content: 'summary',
				},
				{
					name: 'twitter:creator',
					content: site.siteMetadata.author,
				},
				{
					name: 'twitter:title',
					content: title !== '' ? title : homeTitle,
				},
				{
					name: 'twitter:description',
					content: metaDescription,
				},
			].concat(meta)}
		>
			<link
				rel="alternate"
				title="Subscribe to the latest episodes"
				type="application/rss+xml"
				href={site.siteMetadata.feedUrl}
			/>
		</Helmet>
	);
};

export default SEO;
