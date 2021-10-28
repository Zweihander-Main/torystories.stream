import { renderHook } from '@testing-library/react-hooks';
import usePlayerState from 'hooks/usePlayerStatus';
import { useStaticQuery } from 'gatsby';
import PlayerContext from 'contexts/PlayerContext';
import React from 'react';

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
				playedSeconds: 0,
				setPlayedSeconds: () => undefined,
				isPlayerPlaying: false,
				setIsPlayerPlaying: () => undefined,
				playerVolume: 1,
				setPlayerVolume: () => undefined,
				isPlayerMuted: false,
				setIsPlayerMuted: () => undefined,
				playerPlaybackRate: 1.0,
				setPlayerPlaybackRate: () => undefined,
				trackId: '1',
				setTrackId: () => undefined,
				trackAudioURL: undefined,
				trackImage: null,
				trackSlug: '',
				trackTitle: '',
				trackEpisodeNum: 1,
				hasStorageBeenReadFromForCurrentTrack: false,
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
		  "playedPercentage": 0,
		  "player": Object {
		    "current": null,
		  },
		  "seeking": false,
		  "setPlayedPercentage": [Function],
		  "setPlayerReady": [Function],
		  "setSeeking": [Function],
		}
	`);
	});
});
