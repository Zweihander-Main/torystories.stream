/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import './src/styles/index.css';

import React from 'react';
import Player from './src/components/Player';
import AppProvider from './src/contexts/AppContext';

export const wrapRootElement = ({ element }) => (
	<AppProvider>{element}</AppProvider>
);

export const wrapPageElement = ({ element }) => <Player>{element}</Player>;
