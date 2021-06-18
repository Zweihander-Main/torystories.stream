import EpisodeContext from 'contexts/EpisodeContext';
import { useContext, useEffect, useState } from 'react';

// Usage note: do not spread on to JSX Element

type PlayerStateProps = {
	playedSeconds: number;
	setPlayedSeconds: React.Dispatch<React.SetStateAction<number>>;
	id: string;
	setID: React.Dispatch<React.SetStateAction<string>>;
};

const usePlayerState = (defaultID: string): PlayerStateProps => {
	const storage = useContext(EpisodeContext);

	const [playedSeconds, setPlayedSeconds] = useState(0);
	const [id, setID] = useState(defaultID);

	useEffect(() => {
		const currentID = storage.readCurrent();
		if (currentID) {
			setID(currentID);
			const currentSeconds = storage.readPlayed(id);
			if (currentSeconds) {
				setPlayedSeconds(currentSeconds);
			}
		}
	}, []);

	const saveID = () => {
		storage.saveCurrent(id);
	};

	const savePlayed = () => {
		storage.savePlayed(id, playedSeconds);
	};

	useEffect(() => {
		saveID();
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
