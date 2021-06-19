import React, { useState } from 'react';
import SessionStorage from 'utils/sessionStorage';

type PlayerContextProps = {
	storage: SessionStorage;
	playedSeconds: number;
	setPlayedSeconds: (s: number) => void;
};

const PlayerContext = React.createContext<PlayerContextProps>({
	storage: SessionStorage.getInstance(),
	playedSeconds: 0,
	setPlayedSeconds: () => {},
});

export default PlayerContext;

export const PlayerProvider: React.FC = ({ children }) => {
	const storage = SessionStorage.getInstance();
	const [playedSeconds, setPlayedSeconds] = useState(0);

	return (
		<PlayerContext.Provider
			value={{ storage, playedSeconds, setPlayedSeconds }}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export const { Consumer: PlayerConsumer } = PlayerContext;
