import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import MultiSelector from './index';

const createProps = ({notes, onHandleSelect} = {}) => ({
	notes,
	onHandleSelect,
});

const notes = [
	{id: 1, name: 'Vanilla'},
	{id: 2, name: 'Cloves'},
	{id: 3, name: 'Nutmeg'},
];

describe('MultiSelector componenet', () => {
	afterEach(cleanup);

	it('MultiSelector should render without crashing', () => {
		const onHandleSelect = jest.fn();

		const props = createProps({notes, onHandleSelect});

		const {container} = render(<MultiSelector {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should call the callback function', () => {
		const onHandleSelect = jest.fn();

		const props = createProps({notes, onHandleSelect});

		const {getByText} = render(<MultiSelector {...props} />);

		expect(onHandleSelect).not.toHaveBeenCalled();

		const selectionItem = getByText('Vanilla');
		fireEvent.click(selectionItem.firstChild);

		expect(onHandleSelect).toHaveBeenCalledTimes(1);
	});

	it('Should pass correct args', () => {
		const onHandleSelect = jest.fn();

		const props = createProps({notes, onHandleSelect});

		const {getByText} = render(<MultiSelector {...props} />);

		expect(onHandleSelect).not.toHaveBeenCalled();

		const selectionItem = getByText('Vanilla');

		fireEvent.click(selectionItem.firstChild);

		expect(onHandleSelect).toBeCalledWith(notes[0].id);
	});
});
