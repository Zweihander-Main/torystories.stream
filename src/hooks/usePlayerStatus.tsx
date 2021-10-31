import PlayerProgressContext from 'contexts/PlayerProgressContext';
import PlayerStateContext from 'contexts/PlayerStateContext';
import TrackContext from 'contexts/TrackContext';
import React, { useContext, useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';

// Usage note: do not spread on to JSX Element

type PlayerStateProps = {
	player: React.MutableRefObject<null | ReactPlayer>;
	playedPercentage: number;
	setPlayedPercentage: React.Dispatch<React.SetStateAction<number>>;
	isSeeking: boolean;
	setIsSeeking: React.Dispatch<React.SetStateAction<boolean>>;
	setMediaLoadedAndReady: React.Dispatch<React.SetStateAction<boolean>>;
};

const usePlayerStatus = (): PlayerStateProps => {
	const { playedSeconds, hasStorageSecondsBeenReadForCurrentTrack } =
		useContext(PlayerProgressContext);
	const { trackId } = useContext(TrackContext);

	const player = useRef<null | ReactPlayer>(null);
	const [mediaLoadedAndReady, setMediaLoadedAndReady] = useState(false);
	const [playedPercentage, setPlayedPercentage] = useState(0);
	const [isSeeking, setIsSeeking] = useState(false);
	const [playerNeedsToReSeek, setPlayerNeedsToReSeek] = useState(false);

	// track changed
	useEffect(() => {
		setMediaLoadedAndReady(false);
	}, [trackId]); // fire on track change and after load

	if (playerNeedsToReSeek) {
		// Note: If seekTo is called with 0 seconds, it will glitch the player
		// and force it to output 0 progress indefinitely
		if (player.current && playedSeconds !== 0) {
			player.current.seekTo(playedSeconds);
			const duration = player.current.getDuration();
			if (duration) {
				setPlayedPercentage(playedSeconds / duration);
			}
		}
		setPlayerNeedsToReSeek(false);
	}
	// load retrieved storage data once when player is ready
	useEffect(() => {
		if (
			player.current &&
			mediaLoadedAndReady &&
			hasStorageSecondsBeenReadForCurrentTrack
		) {
			setPlayerNeedsToReSeek(true);
		}
	}, [mediaLoadedAndReady, hasStorageSecondsBeenReadForCurrentTrack]);

	return {
		player,
		playedPercentage,
		setPlayedPercentage,
		isSeeking,
		setIsSeeking,
		setMediaLoadedAndReady,
	};
};

export default usePlayerStatus;
