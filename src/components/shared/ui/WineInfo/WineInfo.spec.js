import React from 'react';
import {cleanup, render} from '@testing-library/react';

import WineInfo from './index';

const createProps = ({name, producer, vintage, region, countryName, score}) => ({
	name,
	producer,
	vintage,
	region,
	countryName,
	score,
});

describe('WineInfo', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(<WineInfo />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should render sample info', () => {
		const props = createProps({
			name: 'Palacio de Anglona Tempranillo',
			producer: 'Hombre',
			vintage: 2008,
			region: 'Rioja',
			countryName: 'Spain',
			score: 91,
		});
		const {getByText} = render(<WineInfo {...props} />);
		expect(getByText('Palacio de Anglona Tempranillo')).toBeTruthy();
		expect(getByText('Hombre')).toBeTruthy();
		expect(getByText('2008')).toBeTruthy();
		expect(getByText('Rioja')).toBeTruthy();
		expect(getByText('Spain')).toBeTruthy();
		expect(getByText('91')).toBeTruthy();
	});
});
