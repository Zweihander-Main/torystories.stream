/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import * as React from 'react';
import './src/styles/index.css';
import { wrapRoot, wrapPage } from './gatsby-common';

export const wrapRootElement = wrapRoot;
export const wrapPageElement = wrapPage;

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
				/^Location$/,
				/^RouteAnnouncer$/,
				/^Unknown$/,
				/^[A-Z]$/,
				/^Placeholder$/,
				/^MainImage$/,
				/^Picture$/,
				/^StaticQueryStore$/,
			],
			collapseGroups: true,
		});
	}
};
