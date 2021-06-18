import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import { TemplatePageContext } from '../types';

const EpisodeTemplate: React.FC<
	PageProps<GatsbyTypes.EpisodeBySlug, TemplatePageContext>
> = ({ data, pageContext }) => {
	const post = data.markdownRemark;
	const { next, prev } = pageContext;

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
					relativePath
					absolutePath
				}
				audioFile {
					relativePath
					absolutePath
				}
				syndicationLinks
				subtitles {
					relativePath
					absolutePath
				}
			}
		}
	}
`;
