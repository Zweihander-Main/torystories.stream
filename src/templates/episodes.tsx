import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from 'components/structure/Layout';
import SEO from 'components/structure/SEO';
import { TemplatePageContext } from '../types';

const EpisodeTemplate: React.FC<
	PageProps<GatsbyTypes.EpisodeBySlug, TemplatePageContext>
> = ({ data, pageContext }) => {
	const post = data.markdownRemark;
	const { next, prev, subtitlesArray } = pageContext;

	return (
		<Layout darkMenu={true}>
			<SEO
				title={post?.frontmatter?.title || ''}
				description={
					post?.frontmatter?.description || post?.excerpt || ''
				}
			/>
			{JSON.stringify(post)}
			{JSON.stringify(next)}
			{JSON.stringify(prev)}
			{JSON.stringify(subtitlesArray)}
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
					publicURL
				}
				syndicationLinks
				subtitles {
					publicURL
				}
			}
		}
	}
`;
