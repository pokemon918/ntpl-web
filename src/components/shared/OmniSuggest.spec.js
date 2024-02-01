import React from 'react';
import {cleanup} from '@testing-library/react';

import OmniSuggest from './OmniSuggest';

const props = ['1test', '2test', '3test', '4test'];

describe('OmniSuggest', () => {
	afterEach(cleanup);

	it('Should construct without crashing', () => {
		const container = new OmniSuggest(props);
		expect(container).toBeTruthy();
	});

	it('Should return input result', () => {
		const container = new OmniSuggest(props);
		let result = container.input('2');
		expect(result).toEqual(['2test']);
	});

	it('Should return result search', () => {
		const container = new OmniSuggest(props);
		container.input('3test');
		let result = container.suggest();
		expect(result).toEqual([{val: '3test'}]);
	});
});
