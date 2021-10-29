import PlayerProgressContext from 'contexts/PlayerProgressContext';
import TrackContext from 'contexts/TrackContext';
import React, { useContext, useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';

// Usage note: do not spread on to JSX Element

type PlayerStateProps = {
	player: React.MutableRefObject<null | ReactPlayer>;
	playedPercentage: number;
	setPlayedPercentage: React.Dispatch<React.SetStateAction<number>>;
	seeking: boolean;
	setSeeking: React.Dispatch<React.SetStateAction<boolean>>;
	setMediaLoadedAndReady: React.Dispatch<React.SetStateAction<boolean>>;
};

const usePlayerState = (): PlayerStateProps => {
	const { playedSeconds, hasStorageSecondsBeenReadForCurrentTrack } =
		useContext(PlayerProgressContext);
	const { trackId } = useContext(TrackContext);

	const player = useRef<null | ReactPlayer>(null);
	const [mediaLoadedAndReady, setMediaLoadedAndReady] = useState(false);
	const [playedPercentage, setPlayedPercentage] = useState(0);
	const [seeking, setSeeking] = useState(false);
	const [playerNeedsToReSeek, setPlayerNeedsToReSeek] = useState(false);

	// track changed
	useEffect(() => {
		setMediaLoadedAndReady(false);
	}, [trackId]); // fire on track change and after load

	if (playerNeedsToReSeek) {
		if (player.current) {
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
		seeking,
		setSeeking,
		setMediaLoadedAndReady,
	};
};

export default usePlayerState;
