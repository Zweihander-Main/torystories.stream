import React from 'react';

interface EpisodeContextInterface {
	playedSeconds: number;
	setPlayedSeconds: React.Dispatch<React.SetStateAction<number>>;
}

const EpisodeContext = React.createContext<EpisodeContextInterface | null>(
	null
);

export default EpisodeContext;

export const EpisodeProvider: React.FC = ({ children }) => {
	const [playedSeconds, setPlayedSeconds] = React.useState(0);

	return (
		<EpisodeContext.Provider value={{ playedSeconds, setPlayedSeconds }}>
			{children}
		</EpisodeContext.Provider>
	);
};

export const { Consumer: EpisodeConsumer } = EpisodeContext;
