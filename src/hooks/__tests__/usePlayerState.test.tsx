import { renderHook } from '@testing-library/react-hooks';
import usePlayerState from 'hooks/usePlayerState';
import { useStaticQuery } from 'gatsby';
import PlayerContext from 'contexts/PlayerContext';
import React from 'react';
import SessionStorage from 'utils/sessionStorage';

describe('usePlayerState hook', () => {
	beforeAll(() => {
		(useStaticQuery as jest.Mock).mockReturnValue({
			allMarkdownRemark: {
				edges: [
					{
						node: {
							id: '1',
							frontmatter: {
								audioFile: {
									publicURL: '/ep2',
								},
							},
						},
					},
				],
			},
		});
	});

	const wrapper = ({ children }: { children?: React.ReactNode }) => (
		<PlayerContext.Provider
			value={{
				storage: SessionStorage.getInstance(),
				playedSeconds: 0,
				idPlaying: '1',
				setIdPlaying: () => undefined,
				setPlayedSeconds: () => undefined,
				playing: false,
				setPlaying: () => undefined,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);

	it('should render and provide neccessary data for player', () => {
		const { result } = renderHook(() => usePlayerState(), {
			wrapper,
		});
		expect(result.current).toMatchInlineSnapshot(`
		Object {
		  "episodeNum": 0,
		  "image": null,
		  "muted": false,
		  "playbackRate": 1,
		  "playedPercentage": 0,
		  "player": Object {
		    "current": null,
		  },
		  "playing": false,
		  "seeking": false,
		  "setMuted": [Function],
		  "setPlaybackRate": [Function],
		  "setPlayedPercentage": [Function],
		  "setPlayedSeconds": [Function],
		  "setPlayerReady": [Function],
		  "setPlaying": [Function],
		  "setSeeking": [Function],
		  "setVolume": [Function],
		  "slug": "",
		  "title": "",
		  "url": "/ep2",
		  "volume": 1,
		}
	`);
	});
});
