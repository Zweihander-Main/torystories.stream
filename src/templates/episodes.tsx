import React, { useContext, useState } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import { TemplatePageContext } from '../types';
import Subtitles from '../components/Subtitles';
import EpisodeInfo from '../components/EpisodeInfo';
import TrackContext from '../contexts/TrackContext';

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
						gatsbyImageData(
							layout: FULL_WIDTH
							placeholder: BLURRED
						)
					}
				}
				syndicationLinks
			}
		}
	}
`;

const EpisodeTemplate: React.FC<
	PageProps<Queries.EpisodeBySlugQuery, TemplatePageContext>
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

	enum TabSelected {
		Subtitles,
		EpisodeInfo,
	}

	const [mobileTabSelected, setMobiletabSelected] = useState<TabSelected>(
		TabSelected.EpisodeInfo
	);

	return (
		<Layout hideFooter={true} showHomeButton={true}>
			<SEO title={title} description={description} />
			<div className="fixed top-0 left-0 grid grid-cols-2 grid-rows-mobileEpInfoTabs lg:grid-rows-1 h-screenMinusPlayerSmall md:h-screenMinusPlayer">
				<div className="flex justify-around h-full col-span-2 row-start-1 pl-10 lg:absolute lg:hidden">
					<div className="contents">
						<button
							className={`w-full text-sm font-bold ${
								mobileTabSelected === TabSelected.EpisodeInfo
									? 'bg-deepPurple shadow-innerButton'
									: 'bg-darkPurple'
							}`}
							onClick={() =>
								setMobiletabSelected(TabSelected.EpisodeInfo)
							}
						>
							Episode Info
						</button>
					</div>
					<div className="contents">
						<button
							className={`w-full text-sm font-bold ${
								mobileTabSelected === TabSelected.Subtitles
									? 'bg-deepPurple shadow-innerButton'
									: 'bg-darkPurple'
							}`}
							onClick={() =>
								setMobiletabSelected(TabSelected.Subtitles)
							}
						>
							Subtitles
						</button>
					</div>
				</div>
				<div
					className={`${
						mobileTabSelected === TabSelected.Subtitles
							? 'contents'
							: 'hidden absolute'
					} lg:contents lg:static`}
				>
					<Subtitles
						{...{
							subtitlesArray,
							image,
							title,
							isCurrentlySelectedInPlayer,
						}}
					/>
				</div>
				<div
					className={`${
						mobileTabSelected === TabSelected.EpisodeInfo
							? 'contents'
							: 'hidden absolute'
					} lg:contents lg:static`}
				>
					<EpisodeInfo
						{...{
							title,
							episodeNum,
							html,
							syndicationLinks,
							date,
							next,
							prev,
							id,
						}}
					/>
				</div>
			</div>
		</Layout>
	);
};

export default EpisodeTemplate;
