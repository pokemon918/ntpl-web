import React from 'react';
import {cleanup, render, fireEvent} from '@testing-library/react';

import SearchResultsList from './index';

const createProps = ({items, onSelect} = {}) => ({
	items: [{name: 'Item A'}, {name: 'Item B'}, {name: 'Item C'}],
	onSelect: jest.fn(),
});

describe('SearchResultsList', () => {
	afterEach(cleanup);

	it('Should render self', () => {
		const {container} = render(<SearchResultsList />);
		expect(container.firstChild);
	});

	it('Should render list of items', () => {
		const props = createProps();
		const {getByText} = render(<SearchResultsList {...props} />);

		const getByContent = (textContent) =>
			getByText((_, element) => element.textContent === textContent);

		expect(getByContent('Item A')).toBeTruthy();
		expect(getByContent('Item B')).toBeTruthy();
		expect(getByContent('Item C')).toBeTruthy();
	});

	it('Should fire callback function when selection changes', () => {
		const props = createProps();
		const {onSelect} = props;
		const {getByText} = render(<SearchResultsList {...props} />);

		const getByContent = (textContent) =>
			getByText((_, element) => element.textContent === textContent);

		expect(onSelect).not.toHaveBeenCalled();

		const itemB = getByContent('Item B');
		fireEvent.click(itemB);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith({name: 'Item B'});
	});
});
