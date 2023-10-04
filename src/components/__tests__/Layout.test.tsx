import * as React from 'react';
import { render } from '@testing-library/react';
import Layout from '../StructLayout';

describe('Layout', () => {
	it('preserves its structure', () => {
		expect(render(<Layout />).container).toMatchSnapshot();
	});
});
