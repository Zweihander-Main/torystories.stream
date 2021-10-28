import PlayerContext from 'contexts/PlayerContext';
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
	const { trackId, playedSeconds, hasStorageBeenReadFromForCurrentTrack } =
		useContext(PlayerContext);

	const [mediaLoadedAndReady, setMediaLoadedAndReady] = useState(false);

	const player = useRef<null | ReactPlayer>(null);
	const [playedPercentage, setPlayedPercentage] = useState(0);
	const [seeking, setSeeking] = useState(false);

	// track changed
	useEffect(() => {
		setMediaLoadedAndReady(false);
	}, [trackId]); // fire on track change and after load

	// load retrieved storage data once when player is ready
	useEffect(() => {
		if (
			player.current &&
			mediaLoadedAndReady &&
			hasStorageBeenReadFromForCurrentTrack
		) {
			player.current.seekTo(playedSeconds);
			const duration = player.current.getDuration();
			if (duration) {
				setPlayedPercentage(playedSeconds / duration);
			}
		}
	}, [mediaLoadedAndReady, hasStorageBeenReadFromForCurrentTrack]);

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
