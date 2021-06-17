import React from 'react';
import { EpisodeProvider } from './EpisodeContext';

const AppProvider: React.FC = ({ children }) => {
	return <EpisodeProvider>{children}</EpisodeProvider>;
};

export default AppProvider;
