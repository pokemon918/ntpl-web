import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import Filter from './index';

const createProps = ({items, selected, onSelect} = {}) => ({
	items,
	selected,
	onSelect,
});

describe('Filter componenet', () => {
	afterEach(cleanup);

	it('Filter should render wihtout crashing', () => {
		const items = [{description: 'Country'}, {description: 'City'}, {description: 'Tasting'}];
		const props = createProps({items});

		const {container} = render(<Filter {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should fire a callback function with the selected filter', () => {
		const items = [{description: 'Country'}, {description: 'City'}, {description: 'Tasting'}];
		const onSelect = jest.fn();

		const props = createProps({items, onSelect});

		const {getByText} = render(<Filter {...props} />);

		expect(onSelect).not.toHaveBeenCalled();

		const countryFilter = getByText('Country');
		fireEvent.click(countryFilter);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith({description: 'Country'});
	});
});
