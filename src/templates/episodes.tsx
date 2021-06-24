import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from 'components/structure/Layout';
import SEO from 'components/structure/SEO';
import { TemplatePageContext } from '../types';
import Subtitles from 'components/episode/Subtitles';
import EpisodeInfo from 'components/episode/EpisodeInfo';

const EpisodeTemplate: React.FC<
	PageProps<GatsbyTypes.EpisodeBySlugQuery, TemplatePageContext>
> = ({ data, pageContext }) => {
	const post = data.markdownRemark;
	const { next, prev, subtitlesArray } = pageContext;

	const title = post?.frontmatter?.title || '';
	const description = post?.frontmatter?.description || post?.excerpt || '';
	const episodeNum = post?.frontmatter?.episodeNum || -1;
	const html = post?.html || '';
	const possibleLinks = post?.frontmatter?.syndicationLinks || [];
	const syndicationLinks =
		typeof possibleLinks[0] === 'string' ? possibleLinks : [];
	const date = post?.frontmatter?.date || '';
	const image =
		post?.frontmatter?.featuredImage?.childImageSharp?.gatsbyImageData ||
		null;

	return (
		<Layout hideFooter={true} showHomeButton={true}>
			<SEO title={title} description={description} />
			<div className="grid grid-cols-2 grid-rows-1">
				<Subtitles
					subtitlesArray={subtitlesArray}
					image={image}
					title={title}
				/>
				<EpisodeInfo
					title={title}
					episodeNum={episodeNum}
					html={html}
					syndicationLinks={syndicationLinks}
					date={date}
					next={next}
					prev={prev}
				/>
			</div>
		</Layout>
	);
};

export default EpisodeTemplate;

export const pageQuery = graphql`
	query EpisodeBySlug($path: String!) {
		markdownRemark(fields: { slug: { eq: $path } }) {
			id
			excerpt(pruneLength: 160)
			html
			frontmatter {
				title
				episodeNum
				date(formatString: "MMMM DD, YYYY")
				description
				featuredImage {
					childImageSharp {
						gatsbyImageData(layout: FULL_WIDTH)
					}
				}
				syndicationLinks
			}
		}
	}
`;

// TODO short screen will not treat sub track correctly as it doesn't extend down
