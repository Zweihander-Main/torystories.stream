import { renderHook } from '@testing-library/react-hooks';
import usePlayerStatus from 'hooks/usePlayerStatus';
import { useStaticQuery } from 'gatsby';
import PlayerProgressContext from 'contexts/PlayerProgressContext';
import React from 'react';

describe('usePlayerStatus hook', () => {
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
		<PlayerProgressContext.Provider
			value={{
				playedSeconds: 0,
				setPlayedSeconds: () => undefined,
				hasStorageSecondsBeenReadForCurrentTrack: false,
				setHasStorageSecondsBeenReadForCurrentTrack: () => undefined,
			}}
		>
			{children}
		</PlayerProgressContext.Provider>
	);

	it('should render and provide neccessary data for player', () => {
		const { result } = renderHook(() => usePlayerStatus(), {
			wrapper,
		});
		expect(result.current).toMatchInlineSnapshot(`
		Object {
		  "playedPercentage": 0,
		  "player": Object {
		    "current": null,
		  },
		  "seeking": false,
		  "setMediaLoadedAndReady": [Function],
		  "setPlayedPercentage": [Function],
		  "setSeeking": [Function],
		}
	`);
	});
});
