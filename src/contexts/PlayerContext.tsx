import { graphql, useStaticQuery } from 'gatsby';
import { IGatsbyImageData } from 'gatsby-plugin-image';
import useEpisodeList from 'hooks/useEpisodeList';
import React, { useCallback, useEffect, useState } from 'react';
import SessionStorage from 'utils/sessionStorage';

type PlayerContextProps = {
	playedSeconds: number;
	setPlayedSeconds: (seconds: number) => void;
	isPlayerPlaying: boolean;
	setIsPlayerPlaying: (playing: boolean) => void;
	playerVolume: number;
	setPlayerVolume: (volume: number) => void;
	isPlayerMuted: boolean;
	setIsPlayerMuted: (muted: boolean) => void;
	playerPlaybackRate: number;
	setPlayerPlaybackRate: (rate: number) => void;
	trackId: string;
	setTrackId: (id: string) => void;
	trackAudioURL: string | undefined;
	trackImage: IGatsbyImageData | null;
	trackSlug: string;
	trackTitle: string;
	trackEpisodeNum: number;
	hasStorageBeenReadFromForCurrentTrack: boolean;
};

const PlayerContext = React.createContext<PlayerContextProps>({
	playedSeconds: 0,
	setPlayedSeconds: () => undefined,
	isPlayerPlaying: false,
	setIsPlayerPlaying: () => undefined,
	playerVolume: 1,
	setPlayerVolume: () => undefined,
	isPlayerMuted: false,
	setIsPlayerMuted: () => undefined,
	playerPlaybackRate: 1.0,
	setPlayerPlaybackRate: () => undefined,
	trackId: '',
	setTrackId: () => undefined,
	trackAudioURL: undefined,
	trackImage: null,
	trackSlug: '',
	trackTitle: '',
	trackEpisodeNum: 1,
	hasStorageBeenReadFromForCurrentTrack: false,
});

export default PlayerContext;

export const PlayerProvider: React.FC = ({ children }) => {
	const defaultID =
		useStaticQuery<GatsbyTypes.DefaultEpisodeIDQueryQuery>(graphql`
			query DefaultEpisodeIDQuery {
				allMarkdownRemark(
					limit: 1
					sort: { fields: frontmatter___date, order: DESC }
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
		`);

	const storage = SessionStorage.getInstance();
	const [
		hasStorageBeenReadFromForCurrentTrack,
		setHasStorageBeenReadFromForCurrentTrack,
	] = useState(false);
	const [playedSeconds, setPlayedSeconds] = useState(0);
	const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);
	const [playerVolume, setPlayerVolume] = useState(1);
	const [isPlayerMuted, setIsPlayerMuted] = useState(false);
	const [playerPlaybackRate, setPlayerPlaybackRate] = useState(1.0);

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

	const loadSavedSeconds = useCallback(
		(id: string) => {
			const currentSeconds = storage.readPlayed(id);
			if (currentSeconds) {
				setPlayedSeconds(currentSeconds);
			} else {
				setPlayedSeconds(0);
			}
			setHasStorageBeenReadFromForCurrentTrack(true);
		},
		[storage]
	);

	// Load saved data on initial storage load
	useEffect(() => {
		const currentId = storage.readCurrent();
		if (currentId) {
			setTrackId(currentId);
			loadSavedSeconds(currentId);
			const storedState = storage.readPlayerState();
			if (storedState) {
				const {
					volume: sVolume,
					muted: sMuted,
					playbackRate: sPlaybackRate,
				} = storedState;
				setPlayerVolume(sVolume);
				setIsPlayerMuted(sMuted);
				setPlayerPlaybackRate(sPlaybackRate);
			}
		}
	}, [storage, loadSavedSeconds]); // fire on storage init/on load

	// Track changed
	useEffect(() => {
		// setPlayerReady(false);
		setHasStorageBeenReadFromForCurrentTrack(false);
		storage.saveCurrent(trackId);
		const epData = getEpByID(trackId);
		loadSavedSeconds(trackId);
		setTrackAudioURL(epData.audioURL);
		setTrackImage(epData.featuredImage);
		setTrackSlug(epData.slug);
		setTrackTitle(epData.title);
		setTrackEpisodeNum(epData.episodeNum);
	}, [trackId, loadSavedSeconds, storage, getEpByID]); // fire on id and after load

	// save state on change
	useEffect(() => {
		storage.savePlayerState({
			volume: playerVolume,
			muted: isPlayerMuted,
			playbackRate: playerPlaybackRate,
		});
	}, [playerVolume, isPlayerMuted, playerPlaybackRate, storage]); // fire on volume/muted/rate and after load

	// save played seconds on progress or track change
	useEffect(() => {
		storage.savePlayed(trackId, playedSeconds);
	}, [playedSeconds, trackId, storage]); // fire on played, track change, and after load

	return (
		<PlayerContext.Provider
			value={{
				playedSeconds,
				setPlayedSeconds,
				isPlayerPlaying,
				setIsPlayerPlaying,
				playerVolume,
				setPlayerVolume,
				isPlayerMuted,
				setIsPlayerMuted,
				playerPlaybackRate,
				setPlayerPlaybackRate,
				trackId,
				setTrackId,
				trackAudioURL,
				trackImage,
				trackSlug,
				trackTitle,
				trackEpisodeNum,
				hasStorageBeenReadFromForCurrentTrack,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export const { Consumer: PlayerConsumer } = PlayerContext;
