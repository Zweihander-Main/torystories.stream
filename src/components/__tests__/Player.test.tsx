import * as React from 'react';
import { act, render } from '@testing-library/react';
import Player from '../Player';

describe('Player ', () => {
	it('renders', async () => {
		let player = null;
		await act(async () => {
			player = render(
				<Player>
					<div />
				</Player>
			).container;
			await new Promise((resolve) => setTimeout(resolve, 100));
		});
		expect(player).toBeDefined();
	});
});
