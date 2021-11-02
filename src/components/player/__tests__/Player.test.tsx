import React from 'react';
import { render } from '@testing-library/react';
import Player from '../Player';

describe('Player ', () => {
	it('renders', () => {
		expect(render(<Player />).container);
	});
});
