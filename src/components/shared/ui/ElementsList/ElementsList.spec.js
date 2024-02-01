import React from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react';

import ElementsList from './index';

const getHtmlElements = () => (
	<div>
		<div
			data-find="Palacio de Anglona Pinot Noir"
			style={{
				marginTop: '20px',
				color: '#b0a5b8',
				fontFamily: 'Raleyway, sans-serif',
				fontSize: '1rem',
			}}
		>
			<span>Palacio de Anglona Pinot Noir</span>
		</div>
		<div
			data-find="Palacio de Anglona Pinot Noir"
			style={{
				marginTop: '20px',
				color: '#b0a5b8',
				fontFamily: 'Raleyway, sans-serif',
				fontSize: '1rem',
			}}
		>
			<span>Palacio de Anglona Pinot Noir</span>
		</div>
		<div
			data-find="Palacio de Anglona Merlot"
			style={{
				marginTop: '20px',
				color: '#b0a5b8',
				fontFamily: 'Raleyway, sans-serif',
				fontSize: '1rem',
			}}
		>
			<span>Palacio de Anglona Merlot</span>
		</div>
	</div>
);

describe('ElementsList', () => {
	afterEach(() => {
		cleanup();
		jest.clearAllMocks();
	});

	it('Should render self with List of elements', () => {
		const {getAllByText} = render(<ElementsList> {getHtmlElements()} </ElementsList>);

		expect(getAllByText('Palacio de Anglona Pinot Noir')).toBeTruthy();
		expect(getAllByText('Palacio de Anglona Pinot Noir')).toBeTruthy();
		expect(getAllByText('Palacio de Anglona Merlot')).toBeTruthy();
	});

	it('Should filter the list of elements', () => {
		const {getByPlaceholderText, getAllByText} = render(
			<ElementsList>{getHtmlElements()}</ElementsList>
		);
		expect(getAllByText('Palacio de Anglona Pinot Noir')).toBeTruthy();
		const input = getByPlaceholderText('Search');

		fireEvent.change(input, {target: {value: 'rlot'}});
		expect(input.value).toBe('rlot');

		expect(getAllByText('Palacio de Anglona Merlot')).toBeTruthy();
	});
});
