import { graphql, useStaticQuery } from 'gatsby';
import { IGatsbyImageData } from 'gatsby-plugin-image';
import useEpisodeList from '../hooks/useEpisodeList';
import React, {
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import StorageContext from './StorageContext';

type TrackContextProps = {
	trackId: string;
	setTrackId: (id: string) => void;
	trackAudioURL: string | undefined;
	trackImage: IGatsbyImageData | null;
	trackSlug: string;
	trackTitle: string;
	trackEpisodeNum: number;
};

const TrackContext = React.createContext<TrackContextProps>({
	trackId: '',
	setTrackId: () => undefined,
	trackAudioURL: undefined,
	trackImage: null,
	trackSlug: '',
	trackTitle: '',
	trackEpisodeNum: 1,
});

export default TrackContext;

export const TrackProvider: React.FC<{ children?: ReactNode }> = ({
	children,
}) => {
	const defaultID = useStaticQuery<Queries.DefaultEpisodeIDQueryQuery>(
		graphql`
			query DefaultEpisodeIDQuery {
				allMarkdownRemark(
					limit: 1
					sort: { frontmatter: { date: DESC } }
					filter: {
						fields: { sourceInstanceName: { eq: "episodes" } }
					}
				) {
					edges {
						node {
							id
						}
					}
				}
			}
		`
	);

	const { loadSavedId, saveTrackId } = useContext(StorageContext);

	const [trackId, setTrackId] = useState(
		defaultID.allMarkdownRemark.edges[0].node.id
	);

	const { getEpByID } = useEpisodeList();
	const defaultEpData = getEpByID(trackId);

	const [trackAudioURL, setTrackAudioURL] = useState(
		defaultEpData.audioURL || undefined
	);
	const [trackImage, setTrackImage] = useState(defaultEpData.featuredImage);
	const [trackSlug, setTrackSlug] = useState(defaultEpData.slug);
	const [trackTitle, setTrackTitle] = useState(defaultEpData.title);
	const [trackEpisodeNum, setTrackEpisodeNum] = useState(
		defaultEpData.episodeNum
	);

	// initial load
	useEffect(() => {
		const currentId = loadSavedId();
		if (currentId) {
			setTrackId(currentId);
		}
	}, [loadSavedId]);

	// Track changed
	useEffect(() => {
		saveTrackId(trackId);
		const epData = getEpByID(trackId);
		setTrackAudioURL(epData.audioURL);
		setTrackImage(epData.featuredImage);
		setTrackSlug(epData.slug);
		setTrackTitle(epData.title);
		setTrackEpisodeNum(epData.episodeNum);
	}, [trackId, getEpByID, saveTrackId]);

	const providerValue = useMemo(
		() => ({
			trackId,
			setTrackId,
			trackAudioURL,
			trackImage,
			trackSlug,
			trackTitle,
			trackEpisodeNum,
		}),
		[
			trackId,
			setTrackId,
			trackAudioURL,
			trackImage,
			trackSlug,
			trackTitle,
			trackEpisodeNum,
		]
	);

	return (
		<TrackContext.Provider value={providerValue}>
			{children}
		</TrackContext.Provider>
	);
};

export const { Consumer: TrackConsumer } = TrackContext;
