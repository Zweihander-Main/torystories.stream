import { renderHook } from '@testing-library/react-hooks';
import useEpisodeList from '../../hooks/useEpisodeList';
import { useStaticQuery } from 'gatsby';

describe('useEpisodeList hook', () => {
	beforeAll(() => {
		(useStaticQuery as jest.Mock).mockReturnValue({
			allMarkdownRemark: {
				edges: [
					{
						node: {
							id: '1',
							frontmatter: {
								audioFile: {
									publicURL: '/ep1',
								},
							},
						},
					},
					{
						node: {
							id: '2',
						},
					},
				],
			},
		});
	});

	it('should render and return valid data', () => {
		const { result } = renderHook(() => useEpisodeList());
		const { episodeArray, getEpByID } = result.current;
		expect(episodeArray).toHaveLength(2);
		expect(getEpByID('1').audioURL).toBe('/ep1');
	});
});
