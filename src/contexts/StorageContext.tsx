import React, { ReactNode } from 'react';
import SessionStorage, { PlayerState } from 'utils/sessionStorage';

type StorageContextProps = {
	loadSavedId: () => string | undefined;
	loadSavedSeconds: (id: string) => number | undefined;
	loadSavedState: () => PlayerState | undefined;
	saveTrackId: (id: string) => void;
	savePlayedSeconds: (id: string, played: number) => void;
	savePlayerState: (
		volume: number,
		muted: boolean,
		playbackRate: number
	) => void;
};

const StorageContext = React.createContext<StorageContextProps>({
	loadSavedId: () => undefined,
	loadSavedSeconds: () => undefined,
	loadSavedState: () => undefined,
	saveTrackId: () => undefined,
	savePlayedSeconds: () => undefined,
	savePlayerState: () => undefined,
});

export default StorageContext;

export const StorageProvider: React.FC<{ children?: ReactNode }> = ({
	children,
}) => {
	const storage = SessionStorage.getInstance();

	const loadSavedId = () => {
		return storage.readCurrent();
	};

	const loadSavedSeconds = (id: string) => {
		return storage.readPlayed(id);
	};

	const loadSavedState = () => {
		return storage.readPlayerState();
	};

	const saveTrackId = (id: string) => {
		storage.saveCurrent(id);
	};

	const savePlayedSeconds = (id: string, played: number) => {
		storage.savePlayed(id, played);
	};

	const savePlayerState = (
		volume: number,
		muted: boolean,
		playbackRate: number
	) => {
		storage.savePlayerState({
			volume,
			muted,
			playbackRate,
		});
	};

	return (
		<StorageContext.Provider
			value={{
				loadSavedId,
				loadSavedSeconds,
				loadSavedState,
				saveTrackId,
				savePlayedSeconds,
				savePlayerState,
			}}
		>
			{children}
		</StorageContext.Provider>
	);
};

export const { Consumer: StorageConsumer } = StorageContext;
