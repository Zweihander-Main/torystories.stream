import React from 'react';
import SessionStorage from 'utils/sessionStorage';

const EpisodeContext = React.createContext<SessionStorage>(
	SessionStorage.getInstance()
);

export default EpisodeContext;

export const EpisodeProvider: React.FC = ({ children }) => {
	const storage = SessionStorage.getInstance();
	return (
		<EpisodeContext.Provider value={storage}>
			{children}
		</EpisodeContext.Provider>
	);
};

export const { Consumer: EpisodeConsumer } = EpisodeContext;
