import React, { useContext, useEffect, useState } from 'react';
import StorageContext from './StorageContext';
import TrackContext from './TrackContext';

type PlayerProgressContextProps = {
	playedSeconds: number;
	setPlayedSeconds: (seconds: number) => void;
	hasStorageSecondsBeenReadForCurrentTrack: boolean;
	setHasStorageSecondsBeenReadForCurrentTrack: (b: boolean) => void;
};

const PlayerProgressContext = React.createContext<PlayerProgressContextProps>({
	playedSeconds: 0,
	setPlayedSeconds: () => undefined,
	hasStorageSecondsBeenReadForCurrentTrack: false,
	setHasStorageSecondsBeenReadForCurrentTrack: () => undefined,
});

export default PlayerProgressContext;

export const PlayerProgressProvider: React.FC = ({ children }) => {
	const [playedSeconds, setPlayedSeconds] = useState(0);
	const { loadSavedSeconds, savePlayedSeconds } = useContext(StorageContext);
	const { trackId } = useContext(TrackContext);
	const [
		hasStorageSecondsBeenReadForCurrentTrack,
		setHasStorageSecondsBeenReadForCurrentTrack,
	] = useState(false);

	// On load, track change
	useEffect(() => {
		setHasStorageSecondsBeenReadForCurrentTrack(false);
		const seconds = loadSavedSeconds(trackId);
		if (seconds) {
			setPlayedSeconds(seconds);
		} else {
			setPlayedSeconds(0);
		}
		setHasStorageSecondsBeenReadForCurrentTrack(true);
	}, [trackId, loadSavedSeconds]);

	// save played seconds on progress or track change
	useEffect(() => {
		savePlayedSeconds(trackId, playedSeconds);
	}, [playedSeconds, trackId, savePlayedSeconds]);

	return (
		<PlayerProgressContext.Provider
			value={{
				playedSeconds,
				setPlayedSeconds,
				hasStorageSecondsBeenReadForCurrentTrack,
				setHasStorageSecondsBeenReadForCurrentTrack,
			}}
		>
			{children}
		</PlayerProgressContext.Provider>
	);
};

export const { Consumer: PlayerProgressConsumer } = PlayerProgressContext;
