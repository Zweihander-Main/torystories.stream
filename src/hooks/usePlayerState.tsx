import PlayerContext from 'contexts/PlayerContext';
import React, { useContext, useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import useEpisodeList from 'hooks/useEpisodeList';

// Usage note: do not spread on to JSX Element

type UsePlayerStateInputProps = {
	defaultID: string;
};

type PlayerStateProps = {
	player: React.MutableRefObject<null | ReactPlayer>;
	setPlayedSeconds: React.Dispatch<React.SetStateAction<number>>;
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
	setPlayerReady: React.Dispatch<React.SetStateAction<boolean>>;
};

const usePlayerState = ({
	defaultID,
}: UsePlayerStateInputProps): PlayerStateProps => {
	const storage = useContext(PlayerContext);
	const { getEpByID } = useEpisodeList();

	const [storageLoaded, setStorageLoaded] = React.useState(false);
	const [playerReady, setPlayerReady] = React.useState(false);

	const player = useRef<null | ReactPlayer>(null);
	const [playedPercentage, setPlayedPercentage] = useState(0);
	const [playedSeconds, setPlayedSeconds] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [volume, setVolume] = useState(1);
	const [muted, setMuted] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(1.0);
	const [seeking, setSeeking] = useState(false);
	const [id, setID] = useState(defaultID);
	const [url, setURL] = React.useState(getEpByID(id).audioURL || undefined);

	const saveCurrentID = () => {
		storage.saveCurrent(id);
	};

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

	const savePlayed = () => {
		storage.savePlayed(id, playedSeconds);
	};

	// read storage initially, storageLoaded should be false
	useEffect(() => {
		const currentID = storage.readCurrent();
		if (currentID) {
			setID(currentID);
			loadSavedSeconds(currentID);
		}
	}, []);

	// audio changed
	useEffect(() => {
		setPlayerReady(false);
		setStorageLoaded(false);
		saveCurrentID();
		setURL(getEpByID(id).audioURL || undefined);
		loadSavedSeconds(id);
	}, [id]);

	// on progress
	useEffect(() => {
		savePlayed();
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
		setPlayerReady,
	};
};

export default usePlayerState;
