import { useStaticQuery, graphql } from 'gatsby';

type EpisodeListProps = {
	getEpByID: (id: string) => {
		title: string;
		blurb: string;
		date: string;
		episodeNum: number;
		imageURL: string | null;
		audioURL: string | null;
	};
};

const useEpisodeList = (): EpisodeListProps => {
	const episodeListData = useStaticQuery<GatsbyTypes.EpisodeListQuery>(
		graphql`
			query EpisodeList {
				allMarkdownRemark(
					sort: { fields: frontmatter___date, order: DESC }
					filter: {
						fields: { sourceInstanceName: { eq: "episodes" } }
					}
				) {
					edges {
						node {
							id
							frontmatter {
								featuredImage {
									publicURL
								}
								description
								episodeNum
								title
								date(formatString: "MMMM DD, YYYY")
								audioFile {
									publicURL
								}
							}
							excerpt(pruneLength: 160)
						}
					}
				}
			}
		`
	);

	const episodeLookupTable = {};
	episodeListData.allMarkdownRemark.edges.forEach(({ node: episode }) => {
		const { id, excerpt, frontmatter } = episode;
		let featuredImage = null;
		if (frontmatter?.featuredImage) {
			featuredImage = frontmatter?.featuredImage.publicURL;
		}
		episodeLookupTable[id] = {
			title: frontmatter?.title || '',
			blurb: frontmatter?.description || excerpt || '',
			date: frontmatter?.date || '',
			episodeNum: frontmatter?.episodeNum || 0,
			featuredImage,
			audioURL: frontmatter?.audioFile?.publicURL || null,
		};
	});

	const getEpByID = (id: string) => {
		return episodeLookupTable[id];
	};

	return {
		getEpByID,
	};
};

export default useEpisodeList;
