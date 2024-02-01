import React from 'react';
import {cleanup, render, fireEvent} from '@testing-library/react';

import TastingOverviewMenuItem from './TastingOverviewMenuItem';
import {ReactComponent as Icon_Rating} from './Icon_Rating.svg';

const createProps = ({icon, label, onSelectItem}) => ({
	icon,
	label,
	onSelectItem,
});

describe('TastingOverviewMenuItem', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(<TastingOverviewMenuItem />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should render menu text', () => {
		const props = createProps({
			icon: <Icon_Rating />,
			label: 'Rating',
		});
		const {getByText} = render(<TastingOverviewMenuItem {...props} />);
		expect(getByText('Rating')).toBeTruthy();
	});

	it('Should fire callback function when clicked', () => {
		const onSelectItem = jest.fn();
		const props = createProps({
			icon: <Icon_Rating />,
			label: 'Rating',
			onSelectItem,
		});
		const {getByText} = render(<TastingOverviewMenuItem {...props} />);

		const rating = getByText('Rating');
		expect(onSelectItem).not.toHaveBeenCalled();

		fireEvent.click(rating);
		expect(onSelectItem).toHaveBeenCalledTimes(1);
	});
});
