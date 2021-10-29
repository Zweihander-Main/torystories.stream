/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import './src/styles/index.css';

import React from 'react';
import Player from './src/components/player/Player';
import AppProvider from './src/contexts/AppContext';

export const wrapRootElement = ({ element }) => (
	<AppProvider>{element}</AppProvider>
);

export const wrapPageElement = ({ element }) => <Player>{element}</Player>;
// gatsby-browser.js

export const onClientEntry = () => {
	if (process.env.NODE_ENV !== 'production') {
		const whyDidYouRender = require('@welldone-software/why-did-you-render');
		whyDidYouRender(React, {
			trackAllPureComponents: true,
			trackHooks: true,
			include: [/.*/],
			exclude: [
				/^DevOverlay$/,
				/^ErrorBoundary$/,
				/^Link$/,
				/^GatsbyLink$/,
				/^GatsbyLinkLocationWrapper$/,
				/^Unknown$/,
			],
			collapseGroups: true,
		});
	}
};
