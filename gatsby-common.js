import * as React from 'react';
import Player from './src/components/player/Player';
import AppProvider from './src/contexts/AppContext';

export const wrapRoot = ({ element }) => <AppProvider>{element}</AppProvider>;

export const wrapPage = ({ element }) => <Player>{element}</Player>;
