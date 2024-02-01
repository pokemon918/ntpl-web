import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import SplitScreen from './index';

const createProps = ({upperChildren, lowerChildren} = {}) => ({
	upperChildren,
	lowerChildren,
});

describe('SplitScreen componenet', () => {
	afterEach(cleanup);

	const upperChildren = <div>Enjoy a fast tasting</div>;
	const lowerChildren = <div>Lower Element</div>;

	const props = createProps({upperChildren, lowerChildren});

	it('SplitScreen should render without crashing', () => {
		const {container} = render(<SplitScreen {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('SplitScreen should render upper component correctly', () => {
		const {getByText} = render(<SplitScreen {...props} />);

		expect(getByText('Enjoy a fast tasting')).toBeTruthy();
	});

	it('SplitScreen should render lower component correctly', () => {
		const {getByText} = render(<SplitScreen {...props} />);

		expect(getByText('Lower Element')).toBeTruthy();
	});
});
