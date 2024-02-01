import React from 'react';
import {cleanup, render, fireEvent} from '@testing-library/react';

import SearchResultsListItem from './index';

describe('SearchResultsListItem', () => {
	afterEach(cleanup);

	it('Should render self', () => {
		const {container} = render(<SearchResultsListItem />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should fire callback function when clicked', () => {
		const name = 'Foo Bar';
		const onClick = jest.fn();
		const props = {name, onClick};
		const {getByText} = render(<SearchResultsListItem {...props} />);

		expect(onClick).not.toHaveBeenCalled();

		const fooBar = getByText('Foo Bar');
		fireEvent.click(fooBar);

		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
