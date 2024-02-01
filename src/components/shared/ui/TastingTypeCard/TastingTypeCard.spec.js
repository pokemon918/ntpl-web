import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import TastingTypeCard from './index';

const createProps = ({name, requiredMinutes} = {}) => ({
	name,
	requiredMinutes,
});

describe('TastingTypeCard componenet', () => {
	afterEach(cleanup);

	it('TastingTypeCard should render wihtout crashing', () => {
		const name = 'Light';
		const requiredMinutes = '5';

		const props = createProps({name, requiredMinutes});

		const {container} = render(<TastingTypeCard {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('TastingTypeCard should render valid name', () => {
		const name = 'Light';
		const requiredMinutes = '5';

		const props = createProps({name, requiredMinutes});

		const {getByText} = render(<TastingTypeCard {...props} />);

		expect(getByText('Light')).toBeTruthy();
		expect(getByText('Required time: 5 minutes')).toBeTruthy();
	});
});
