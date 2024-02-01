import React from 'react';
import {cleanup, fireEvent} from '@testing-library/react';

import {renderWithIntl} from 'commons/testing';
import Button from './index';

const createProps = ({children, onHandleClick, disabled, variant} = {}) => ({
	variant,
	disabled,
	children,
	onHandleClick,
});

describe('Button componenet', () => {
	afterEach(cleanup);

	it('Button should render without crashing', () => {
		const children = <div>Button</div>;
		const props = createProps({children});

		const {container} = renderWithIntl(<Button {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Event should be fired on clicked', () => {
		const children = <div>Button</div>;
		const onHandleClick = jest.fn();
		const props = createProps({children, onHandleClick});

		const {container} = renderWithIntl(<Button {...props} />);

		expect(onHandleClick).not.toHaveBeenCalled();

		fireEvent.click(container.firstChild);

		expect(onHandleClick).toHaveBeenCalledTimes(1);
	});

	it('Button should be disabled', () => {
		const children = <div>Button</div>;
		const onHandleClick = jest.fn();
		const disabled = true;
		const props = createProps({children, onHandleClick, disabled});

		const {container} = renderWithIntl(<Button {...props} />);
		expect(container.firstChild.disabled).toBeTruthy();

		fireEvent.click(container.firstChild);
		expect(onHandleClick).not.toHaveBeenCalled();
	});

	it('Button should render with default class', () => {
		const children = <div>Button</div>;
		const onHandleClick = jest.fn();
		const style = 'default';

		const props = createProps({style, children, onHandleClick});

		const {container} = renderWithIntl(<Button {...props} />);
		expect(container.firstChild.className).toBe('Button Button__Default Size--normal');
	});

	it('Button should render with given class', () => {
		const children = <div>Button</div>;
		const onHandleClick = jest.fn();
		const variant = 'outlined';

		const props = createProps({variant, children, onHandleClick});

		const {container} = renderWithIntl(<Button {...props} />);

		expect(container.firstChild.className).toBe('Button Button__Outlined Size--normal');
	});
});
