import React from 'react';
import { render } from '@testing-library/react';
import { PlayerProvider } from '../PlayerContext';
import { useStaticQuery } from 'gatsby';

describe('PlayerContext', () => {
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

	it('renders a component', () => {
		expect(render(<PlayerProvider />));
	});
});
