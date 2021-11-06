import React, { useContext } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from 'components/structure/Layout';
import SEO from 'components/structure/SEO';
import { TemplatePageContext } from '../types';
import Subtitles from 'components/episode/Subtitles';
import EpisodeInfo from 'components/episode/EpisodeInfo';
import TrackContext from 'contexts/TrackContext';

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

const EpisodeTemplate: React.FC<
	PageProps<GatsbyTypes.EpisodeBySlugQuery, TemplatePageContext>
> = ({ data, pageContext }) => {
	const post = data.markdownRemark;
	const { next, prev, subtitlesArray } = pageContext;

	const id = post?.id || '';
	const title = post?.frontmatter?.title || '';
	const description = post?.frontmatter?.description || post?.excerpt || '';
	const episodeNum = post?.frontmatter?.episodeNum || -1;
	const html = post?.html || '';
	const syndicationLinks = (post?.frontmatter?.syndicationLinks || []).map(
		(link) => link || ''
	);
	const date = post?.frontmatter?.date || '';
	const image =
		post?.frontmatter?.featuredImage?.childImageSharp?.gatsbyImageData ||
		null;

	const { trackId } = useContext(TrackContext);

	const isCurrentlySelectedInPlayer = id === trackId;

	return (
		<Layout hideFooter={true} showHomeButton={true}>
			<SEO title={title} description={description} />
			<div className="grid grid-cols-2 grid-rows-1 h-screenMinusPlayer fixed left-0 top-0">
				<Subtitles
					{...{
						subtitlesArray,
						image,
						title,
						isCurrentlySelectedInPlayer,
					}}
				/>
				<EpisodeInfo
					{...{
						title,
						episodeNum,
						html,
						syndicationLinks,
						date,
						next,
						prev,
					}}
				/>
			</div>
		</Layout>
	);
};

export default EpisodeTemplate;
