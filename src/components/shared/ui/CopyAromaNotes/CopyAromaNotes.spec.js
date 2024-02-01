import React from 'react';
import {cleanup, fireEvent, render, getByTestId} from '@testing-library/react';

import CopyAromaNotes from './index';

const createProps = ({onClickCopy, onClickSkip} = {}) => ({
	onClickCopy,
	onClickSkip,
});

describe('CopyAromaNotes componenet', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const onClickCopy = jest.fn();
		const onClickSkip = jest.fn();

		const props = createProps({onClickCopy, onClickSkip});

		const {container} = render(<CopyAromaNotes {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should fire copy function when button is clicked', () => {
		const onClickCopy = jest.fn();
		const onClickSkip = jest.fn();

		const props = createProps({onClickCopy, onClickSkip});

		const {getByText, getByTestId} = render(<CopyAromaNotes {...props} />);

		expect(onClickCopy).not.toBeCalled();
		expect(onClickSkip).not.toBeCalled();

		const copyElement = getByText('Copy all Aroma Notes.');

		fireEvent.click(copyElement.firstChild);

		expect(onClickCopy).toHaveBeenCalledTimes(1);
		expect(onClickSkip).not.toBeCalled();
	});

	it('Should fire close function when close button is clicked', () => {
		const onClickCopy = jest.fn();
		const onClickSkip = jest.fn();

		const props = createProps({onClickCopy, onClickSkip});

		const {getByText, getByTestId} = render(<CopyAromaNotes {...props} />);

		expect(onClickCopy).not.toBeCalled();
		expect(onClickSkip).not.toBeCalled();

		const dontCopyElement = getByText('Do not copy aroma notes.');

		fireEvent.click(dontCopyElement);

		expect(onClickCopy).not.toBeCalled();
		expect(onClickSkip).toHaveBeenCalledTimes(1);
	});

	it('Should fire close function when top left button is clicked', () => {
		const onClickCopy = jest.fn();
		const onClickSkip = jest.fn();

		const props = createProps({onClickCopy, onClickSkip});

		const {getByText} = render(<CopyAromaNotes {...props} />);

		expect(onClickCopy).not.toBeCalled();
		expect(onClickSkip).not.toBeCalled();

		const skipElement = getByText('×');

		fireEvent.click(skipElement);

		expect(onClickCopy).not.toBeCalled();
		expect(onClickSkip).toHaveBeenCalledTimes(1);
	});
});
