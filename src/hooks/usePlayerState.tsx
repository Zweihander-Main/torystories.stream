import PlayerContext from 'contexts/PlayerContext';
import React, { useContext, useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import useEpisodeList from 'hooks/useEpisodeList';
import { IGatsbyImageData } from 'gatsby-plugin-image';

// Usage note: do not spread on to JSX Element

type PlayerStateProps = {
	player: React.MutableRefObject<null | ReactPlayer>;
	setPlayedSeconds: (s: number) => void;
	playedPercentage: number;
	setPlayedPercentage: React.Dispatch<React.SetStateAction<number>>;
	playing: boolean;
	setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	volume: number;
	setVolume: React.Dispatch<React.SetStateAction<number>>;
	muted: boolean;
	setMuted: React.Dispatch<React.SetStateAction<boolean>>;
	playbackRate: number;
	setPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
	seeking: boolean;
	setSeeking: React.Dispatch<React.SetStateAction<boolean>>;
	url: string | undefined;
	image: IGatsbyImageData | null;
	slug: string;
	title: string;
	episodeNum: number;
	setPlayerReady: React.Dispatch<React.SetStateAction<boolean>>;
};

const usePlayerState = (): PlayerStateProps => {
	const {
		storage,
		playedSeconds,
		setPlayedSeconds,
		idPlaying,
		setIdPlaying,
		playing,
		setPlaying,
	} = useContext(PlayerContext);

	const { getEpByID } = useEpisodeList();

	const [storageLoaded, setStorageLoaded] = useState(false);
	const [playerReady, setPlayerReady] = useState(false);

	const player = useRef<null | ReactPlayer>(null);
	const [playedPercentage, setPlayedPercentage] = useState(0);
	const [volume, setVolume] = useState(1);
	const [muted, setMuted] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(1.0);
	const [seeking, setSeeking] = useState(false);
	const defaultEpData = getEpByID(idPlaying);
	const [url, setURL] = useState(defaultEpData.audioURL || undefined);
	const [image, setImage] = useState(defaultEpData.featuredImage);
	const [slug, setSlug] = useState(defaultEpData.slug);
	const [title, setTitle] = useState(defaultEpData.title);
	const [episodeNum, setEpisodeNum] = useState(defaultEpData.episodeNum);

	const loadSavedSeconds = (id: string) => {
		const currentSeconds = storage.readPlayed(id);
		if (currentSeconds) {
			setPlayedSeconds(currentSeconds);
			setStorageLoaded(true);
		}
		// The player may not be ready at this point so both seekTo
		// and getDuration are not available. Thus, use dual latch
		// system with playerReady and storageLoaded plus useEffect below.
	};

	const loadPlayerState = () => {
		const storedState = storage.readPlayerState();
		if (storedState) {
			const {
				volume: sVolume,
				muted: sMuted,
				playbackRate: sPlaybackRate,
			} = storedState;
			setVolume(sVolume);
			setMuted(sMuted);
			setPlaybackRate(sPlaybackRate);
		}
	};

	// read storage initially, storageLoaded should be false
	useEffect(() => {
		const currentID = storage.readCurrent();
		if (currentID) {
			setIdPlaying(currentID);
			loadPlayerState();
			loadSavedSeconds(currentID);
		}
	}, []);

	// audio changed
	useEffect(() => {
		setPlayerReady(false);
		setStorageLoaded(false);
		storage.saveCurrent(idPlaying);
		const epData = getEpByID(idPlaying);
		setURL(epData.audioURL || undefined);
		loadSavedSeconds(idPlaying);
		setImage(epData.featuredImage);
		setSlug(epData.slug);
		setTitle(epData.title);
		setEpisodeNum(epData.episodeNum);
	}, [idPlaying]);

	// on progress
	useEffect(() => {
		storage.savePlayed(idPlaying, playedSeconds);
	}, [playedSeconds]);

	// load retrieved storage data when player is ready
	useEffect(() => {
		if (
			player.current &&
			playerReady &&
			storageLoaded &&
			playedSeconds !== 0
		) {
			player.current.seekTo(playedSeconds);
			const duration = player.current.getDuration();
			if (duration) {
				setPlayedPercentage(playedSeconds / duration);
			}
		}
	}, [playerReady, storageLoaded]);

	// save non-time player state
	useEffect(() => {
		storage.savePlayerState({ volume, muted, playbackRate });
	}, [volume, muted, playbackRate]);

	return {
		player,
		setPlayedSeconds,
		playedPercentage,
		setPlayedPercentage,
		playing,
		setPlaying,
		volume,
		setVolume,
		muted,
		setMuted,
		playbackRate,
		setPlaybackRate,
		seeking,
		setSeeking,
		url,
		image,
		slug,
		title,
		episodeNum,
		setPlayerReady,
	};
};

export default usePlayerState;
