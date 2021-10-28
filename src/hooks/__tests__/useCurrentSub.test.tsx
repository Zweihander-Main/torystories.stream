import { renderHook } from '@testing-library/react-hooks';
import useCurrentSub from 'hooks/useCurrentSub';
import { useStaticQuery } from 'gatsby';
import { SubtitlesArray } from 'types';
import PlayerContext from 'contexts/PlayerContext';
import React from 'react';
import SessionStorage from 'utils/sessionStorage';

const testSubs: SubtitlesArray = [
	{
		text: 'firstSub',
		startTime: 0,
		endTime: 10,
	},
	{
		text: 'secondSub',
		startTime: 10,
		endTime: 20,
	},
];

describe('useCurrentSub hook', () => {
	beforeAll(() => {
		(useStaticQuery as jest.Mock).mockReturnValue({
			allMarkdownRemark: {
				edges: [
					{
						node: {
							id: 'test',
						},
					},
				],
			},
		});
	});

	it('should render and change index as played seconds changes', () => {
		const wrapper = ({
			children,
			played,
		}: {
			children?: React.ReactNode;
			played: number;
		}) => (
			<PlayerContext.Provider
				value={{
					storage: SessionStorage.getInstance(),
					playedSeconds: played,
					idPlaying: '',
					setIdPlaying: () => undefined,
					setPlayedSeconds: () => undefined,
					playing: false,
					setPlaying: () => undefined,
				}}
			>
				{children}
			</PlayerContext.Provider>
		);
		const { rerender, result } = renderHook(() => useCurrentSub(testSubs), {
			wrapper,
			initialProps: {
				played: 0,
			},
		});
		expect(result.current).toBe(0);
		rerender({
			played: 15,
		});
		expect(result.current).toBe(1);
	});
});
