import React from 'react';
import {IntlProvider} from 'react-intl';
import {cleanup, fireEvent} from '@testing-library/react';

import {renderWithIntl} from 'commons/testing';
import CreditCardForm from './index';

describe('Credit Card Form componenet', () => {
	afterEach(cleanup);

	it('CreditCardForm should render without crashing', () => {
		const {container} = renderWithIntl(<CreditCardForm />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should update input values when typing text', () => {
		const {getByPlaceholderText} = renderWithIntl(
			<IntlProvider locale="en">
				<CreditCardForm />
			</IntlProvider>
		);

		const inputCardNo = getByPlaceholderText('Card no.');
		const inputCardHolderName = getByPlaceholderText('Name of Card Holder');
		const inputExpiryMonth = getByPlaceholderText('Month');
		const inputExpiryYear = getByPlaceholderText('Year');
		const inputCVC = getByPlaceholderText('CVC number');

		fireEvent.change(inputCardNo, {target: {value: 4444444444444444}});
		expect(inputCardNo.value).toBe('4444 4444 4444 4444');

		fireEvent.change(inputCardHolderName, {target: {value: 'Mr. X'}});
		expect(inputCardHolderName.value).toBe('Mr. X');

		fireEvent.change(inputExpiryMonth, {target: {value: 12}});
		expect(inputExpiryMonth.value).toBe('12');

		fireEvent.change(inputExpiryYear, {target: {value: 2020}});
		expect(inputExpiryYear.value).toBe('2020');

		fireEvent.change(inputCVC, {target: {value: 123}});
		expect(inputCVC.value).toBe('123');
	});

	it('Should fire callback function with changed form values', () => {
		const onChange = jest.fn();
		const props = {onChange};
		const {getByPlaceholderText} = renderWithIntl(<CreditCardForm {...props} />);

		expect(onChange).not.toHaveBeenCalled();

		const cardNo = getByPlaceholderText('Card no.');
		const cardHolderName = getByPlaceholderText('Name of Card Holder');
		const expiryMonth = getByPlaceholderText('Month');
		const expiryYear = getByPlaceholderText('Year');
		const cvc = getByPlaceholderText('CVC number');

		fireEvent.change(cardNo, {target: {value: 4444444444444444}});
		expect(onChange).toHaveBeenNthCalledWith(1, {
			cardNo: '4444 4444 4444 4444',
			cardHolderName: null,
			expiryMonth: null,
			expiryYear: null,
			cvc: null,
		});

		fireEvent.change(cardHolderName, {target: {value: 'Test User'}});
		expect(onChange).toHaveBeenNthCalledWith(2, {
			cardNo: '4444 4444 4444 4444',
			cardHolderName: 'Test User',
			expiryMonth: null,
			expiryYear: null,
			cvc: null,
		});

		fireEvent.change(expiryMonth, {target: {value: 12}});
		expect(onChange).toHaveBeenNthCalledWith(3, {
			cardNo: '4444 4444 4444 4444',
			cardHolderName: 'Test User',
			expiryMonth: '12',
			expiryYear: null,
			cvc: null,
		});

		fireEvent.change(expiryYear, {target: {value: 22}});
		expect(onChange).toHaveBeenNthCalledWith(4, {
			cardNo: '4444 4444 4444 4444',
			cardHolderName: 'Test User',
			expiryMonth: '12',
			expiryYear: '22',
			cvc: null,
		});

		fireEvent.change(cvc, {target: {value: 123}});
		expect(onChange).toHaveBeenNthCalledWith(5, {
			cardNo: '4444 4444 4444 4444',
			cardHolderName: 'Test User',
			expiryMonth: '12',
			expiryYear: '22',
			cvc: '123',
		});

		expect(onChange).toHaveBeenCalledTimes(5);
	});
});
