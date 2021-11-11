import React from 'react';
import Player from './src/components/player/Player';
import AppProvider from './src/contexts/AppContext';

export const wrapRoot = ({ element }) => <AppProvider>{element}</AppProvider>;

export const wrapPage = ({ element }) => (
	<>
		<noscript className="static top-0 w-full text-center text-white bg-deepPurple">
			This site will work without JavaScript but interactive elements like
			the podcast player will not.{' '}
			<a href="https://github.com/Zweihander-Main/torystories.stream">
				Source code available.
			</a>
		</noscript>
		<Player>{element}</Player>
	</>
);
