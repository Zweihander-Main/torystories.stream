import PlayerContext from 'contexts/PlayerContext';
import { useContext, useEffect, useState } from 'react';

// Usage note: do not spread on to JSX Element

type UsePlayerStateInputProps = {
	defaultID: string;
	onStorageLoad: (seconds: number) => void;
};

type PlayerStateProps = {
	playedSeconds: number;
	setPlayedSeconds: React.Dispatch<React.SetStateAction<number>>;
	id: string;
	setID: React.Dispatch<React.SetStateAction<string>>;
};

const usePlayerState = ({
	defaultID,
	onStorageLoad,
}: UsePlayerStateInputProps): PlayerStateProps => {
	const storage = useContext(PlayerContext);

	const [playedSeconds, setPlayedSeconds] = useState(0);
	const [id, setID] = useState(defaultID);

	useEffect(() => {
		const currentID = storage.readCurrent();
		if (currentID) {
			setID(currentID);
			const currentSeconds = storage.readPlayed(id);
			if (currentSeconds) {
				setPlayedSeconds(currentSeconds);
				onStorageLoad(currentSeconds);
			}
		}
	}, []);

	const saveCurrentID = () => {
		storage.saveCurrent(id);
	};

	const loadSavedSeconds = (id: string) => {
		const currentSeconds = storage.readPlayed(id);
		if (currentSeconds) {
			setPlayedSeconds(currentSeconds);
			onStorageLoad(currentSeconds);
		}
	};

	const savePlayed = () => {
		storage.savePlayed(id, playedSeconds);
	};

	useEffect(() => {
		saveCurrentID();
		loadSavedSeconds(id);
	}, [id]);

	useEffect(() => {
		savePlayed();
	}, [playedSeconds]);

	return {
		playedSeconds,
		setPlayedSeconds,
		id,
		setID,
	};
};

export default usePlayerState;
