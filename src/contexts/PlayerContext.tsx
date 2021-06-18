import React from 'react';
import SessionStorage from 'utils/sessionStorage';

const PlayerContext = React.createContext<SessionStorage>(
	SessionStorage.getInstance()
);

export default PlayerContext;

export const PlayerProvider: React.FC = ({ children }) => {
	const storage = SessionStorage.getInstance();
	return (
		<PlayerContext.Provider value={storage}>
			{children}
		</PlayerContext.Provider>
	);
};

export const { Consumer: PlayerConsumer } = PlayerContext;
