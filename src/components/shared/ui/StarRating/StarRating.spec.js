import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

import StarRating from './index';

const createProps = ({onHandleClick, readOnly, rating} = {}) => ({
	onHandleClick,
	readOnly,
	rating,
});

describe('StarRating componenet', () => {
	afterEach(cleanup);

	it('StarRating should render without crashing', () => {
		const rating = 4;
		const readOnly = false;
		const onHandleClick = jest.fn();

		const props = createProps({rating, readOnly, onHandleClick});

		const {container} = render(<StarRating {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should render five stars', () => {
		const rating = 0;
		const props = createProps({rating});

		const {getByTitle} = render(<StarRating {...props} />);

		expect(getByTitle('1 star')).toBeTruthy();
		expect(getByTitle('2 stars')).toBeTruthy();
		expect(getByTitle('3 stars')).toBeTruthy();
		expect(getByTitle('4 stars')).toBeTruthy();
		expect(getByTitle('5 stars')).toBeTruthy();
	});

	it('Should fire a callback function with the selected rating', () => {
		const rating = 0;
		const onHandleClick = jest.fn();

		const props = createProps({rating, onHandleClick});

		const {getByTitle} = render(<StarRating {...props} />);

		expect(onHandleClick).not.toHaveBeenCalled();

		const threeStars = getByTitle('3 stars');
		fireEvent.click(threeStars);

		expect(onHandleClick).toHaveBeenCalledTimes(1);
		expect(onHandleClick).toHaveBeenCalledWith(3);
	});

	it('Should fire a callback function with another selected rating', () => {
		const rating = 3;
		const onHandleClick = jest.fn();

		const props = createProps({rating, onHandleClick});

		const {getByTitle} = render(<StarRating {...props} />);

		expect(onHandleClick).not.toHaveBeenCalled();

		const fiveStars = getByTitle('5 stars');
		fireEvent.click(fiveStars);

		expect(onHandleClick).toHaveBeenCalledTimes(1);
		expect(onHandleClick).toHaveBeenCalledWith(5);
	});

	it('Should fire a callback function clearing the selected rating', () => {
		const rating = 2;
		const onHandleClick = jest.fn();

		const props = createProps({rating, onHandleClick});

		const {getByTitle} = render(<StarRating {...props} />);

		expect(onHandleClick).not.toHaveBeenCalled();

		const twoStars = getByTitle('2 stars');
		fireEvent.click(twoStars);

		expect(onHandleClick).toHaveBeenCalledTimes(1);
		expect(onHandleClick).toHaveBeenCalledWith(0);
	});
});
