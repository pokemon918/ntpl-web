import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import TrialStatusModal from './index';
import Button from '../Button/index';

const createProps = ({daysLeft, onContinue, onClose} = {}) => ({
	daysLeft,
	onContinue,
	onClose,
});

describe('TrialStatusModal componenet', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const daysLeft = 16;
		const props = createProps({daysLeft});
		const {container} = render(<TrialStatusModal {...props} />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should fire callback function when Close button clicked', () => {
		const daysLeft = 16;
		const onClose = jest.fn();

		const props = createProps({daysLeft, onClose});

		const {getByTitle} = render(<TrialStatusModal {...props} />);

		expect(onClose).not.toHaveBeenCalled();

		const closeButton = getByTitle('Close');
		fireEvent.click(closeButton);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('Should fire callback function when Credit Card Button clicked', () => {
		const daysLeft = 16;
		const onContinue = jest.fn();
		const props = createProps({daysLeft, onContinue});

		const {getByText} = render(<TrialStatusModal {...props} />);

		expect(onContinue).not.toHaveBeenCalled();

		const continueButton = getByText('Enter credit card details now');
		fireEvent.click(continueButton);

		expect(onContinue).toHaveBeenCalledTimes(1);
	});
});
