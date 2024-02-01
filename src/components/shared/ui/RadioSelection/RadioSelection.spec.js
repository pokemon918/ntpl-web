import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import RadioSelection from './index';

const createProps = ({items, onChange} = {}) => ({
	items,
	onChange,
});

const items = [
	{
		id: 'item_1',
		label: 'Free Trial',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
	},
	{
		id: 'item_2',
		label: '12 months',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore',
	},
	{
		id: 'item_3',
		label: 'Coding',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad ',
	},
];

describe('RadioSelection componenet', () => {
	afterEach(cleanup);

	it('RadioSelection should render without crashing', () => {
		const onChange = jest.fn();

		const props = createProps({items, onChange});

		const {container} = render(<RadioSelection {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should fire a callback function with the selected option', () => {
		const onChange = jest.fn();
		const selectedObj = {
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore',
			expand: true,
			id: 'item_2',
			label: '12 months',
		};

		const props = createProps({items, onChange});

		const {getByLabelText} = render(<RadioSelection {...props} />);

		expect(onChange).not.toHaveBeenCalled();

		const itemTwo = getByLabelText('12 months');
		fireEvent.click(itemTwo);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(selectedObj);
	});

	it('Should expand on click', () => {
		const onChange = jest.fn();
		const [firstItem] = items;
		const itemsWithExpanded = items.map((i) => {
			if (i.id === firstItem.id) {
				return {
					...i,
					expand: true,
				};
			}
			return i;
		});

		const props = createProps({items: itemsWithExpanded, onChange});

		const {getByText} = render(<RadioSelection {...props} />);

		expect(getByText(firstItem.description)).toBeTruthy();
	});
});
