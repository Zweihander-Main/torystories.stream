import React, { useContext, useEffect, useState } from 'react';
import StorageContext from './StorageContext';

type PlayerStateContextProps = {
	isPlayerPlaying: boolean;
	setIsPlayerPlaying: (playing: boolean) => void;
	playerVolume: number;
	setPlayerVolume: (volume: number) => void;
	isPlayerMuted: boolean;
	setIsPlayerMuted: (muted: boolean) => void;
	isPlayerBuffering: boolean;
	setIsPlayerBuffering: (muted: boolean) => void;
	playerPlaybackRate: number;
	setPlayerPlaybackRate: (rate: number) => void;
};

const PlayerStateContext = React.createContext<PlayerStateContextProps>({
	isPlayerPlaying: false,
	setIsPlayerPlaying: () => undefined,
	playerVolume: 1,
	setPlayerVolume: () => undefined,
	isPlayerMuted: false,
	setIsPlayerMuted: () => undefined,
	isPlayerBuffering: false,
	setIsPlayerBuffering: () => undefined,
	playerPlaybackRate: 1.0,
	setPlayerPlaybackRate: () => undefined,
});

export default PlayerStateContext;

export const PlayerStateProvider: React.FC = ({ children }) => {
	const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);
	const [playerVolume, setPlayerVolume] = useState(1);
	const [isPlayerMuted, setIsPlayerMuted] = useState(false);
	const [isPlayerBuffering, setIsPlayerBuffering] = useState(false);
	const [playerPlaybackRate, setPlayerPlaybackRate] = useState(1.0);

	const { loadSavedState, savePlayerState } = useContext(StorageContext);

	// Load saved data on initial storage load
	useEffect(() => {
		const storedState = loadSavedState();
		if (storedState) {
			const { volume, muted, playbackRate } = storedState;
			setPlayerVolume(volume);
			setIsPlayerMuted(muted);
			setPlayerPlaybackRate(playbackRate);
		}
	}, [loadSavedState]);

	// save state on change
	useEffect(() => {
		savePlayerState(playerVolume, isPlayerMuted, playerPlaybackRate);
	}, [playerVolume, isPlayerMuted, playerPlaybackRate, savePlayerState]);

	return (
		<PlayerStateContext.Provider
			value={{
				isPlayerPlaying,
				setIsPlayerPlaying,
				playerVolume,
				setPlayerVolume,
				isPlayerMuted,
				setIsPlayerMuted,
				playerPlaybackRate,
				setPlayerPlaybackRate,
				isPlayerBuffering,
				setIsPlayerBuffering,
			}}
		>
			{children}
		</PlayerStateContext.Provider>
	);
};

export const { Consumer: PlayerStateConsumer } = PlayerStateContext;
