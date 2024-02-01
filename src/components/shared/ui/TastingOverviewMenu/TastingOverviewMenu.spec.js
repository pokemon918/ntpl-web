import React from 'react';
import {cleanup, render, fireEvent} from '@testing-library/react';

import TastingOverviewMenu from './index';

describe('TastingOverviewMenu', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(<TastingOverviewMenu />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should render menu texts', () => {
		const {getByText} = render(<TastingOverviewMenu />);
		expect(getByText('Appearance')).toBeTruthy();
		expect(getByText('Nose')).toBeTruthy();
		expect(getByText('Palate')).toBeTruthy();
		expect(getByText('Observation')).toBeTruthy();
		expect(getByText('Rating')).toBeTruthy();
	});

	it('Should fire callback function on item click', () => {
		const onSelectItem = jest.fn();
		const props = {onSelectItem};
		const {getByText} = render(<TastingOverviewMenu {...props} />);
		expect(onSelectItem).not.toHaveBeenCalled();

		const tastingItem = getByText('Appearance');

		fireEvent.click(tastingItem.firstChild);
		expect(onSelectItem).toHaveBeenCalledTimes(1);
		expect(onSelectItem).toHaveBeenCalledWith('Appearance');
	});

	it('Should fire callback function to close the menu', () => {
		const onClose = jest.fn();
		const props = {onClose};
		const {getByText} = render(<TastingOverviewMenu {...props} />);
		const closeButton = getByText('×');

		expect(onClose).not.toHaveBeenCalled();

		fireEvent.click(closeButton);
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
