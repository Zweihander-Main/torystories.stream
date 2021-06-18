import { useStaticQuery, graphql } from 'gatsby';
import { IGatsbyImageData } from 'gatsby-plugin-image';

interface episodeData {
	title: string;
	blurb: string;
	date: string;
	episodeNum: number;
	featuredImage: IGatsbyImageData | null;
	audioURL: string | null;
}

interface episodeDataInArray extends episodeData {
	id: string;
}

type EpisodeListProps = {
	getEpByID: (id: string) => episodeData;
	episodeArray: Array<episodeDataInArray>;
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
									childImageSharp {
										gatsbyImageData(layout: CONSTRAINED)
									}
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

	const episodeLookupTable: { [key: string]: episodeData } = {};
	episodeListData.allMarkdownRemark.edges.forEach(({ node: episode }) => {
		const { id, excerpt, frontmatter } = episode;
		let featuredImage = null;
		if (frontmatter?.featuredImage) {
			featuredImage =
				frontmatter?.featuredImage.childImageSharp?.gatsbyImageData ||
				null;
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

	const episodeArray = Object.entries(episodeLookupTable)
		.map(([id, epData]) => {
			return { id, ...epData };
		})
		.sort((a, b) => {
			// most recent numbers first
			return b.episodeNum - a.episodeNum;
		});

	return {
		getEpByID,
		episodeArray,
	};
};

export default useEpisodeList;
