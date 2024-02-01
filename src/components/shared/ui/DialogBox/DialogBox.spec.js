import React from 'react';
import {IntlProvider} from 'react-intl';
import {cleanup, fireEvent, render, getByTestId} from '@testing-library/react';

import DialogBox from './index';

const createProps = ({title, body, onClose, footer} = {}) => ({
	body,
	title,
	footer,
	onClose,
});

describe('DialogBox componenet', () => {
	afterEach(cleanup);

	it('DialogBox should render without crashing', () => {
		const title = 'Title';
		const body = <div> Body</div>;
		const footer = <div>Footer</div>;
		const onClose = jest.fn();

		const props = createProps({title, body, onClose, footer});

		const {container} = render(<DialogBox {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should render correct value', () => {
		const title = 'Title';
		const description = <div>Body</div>;
		const footer = <div>Footer</div>;
		const onClose = jest.fn();

		const props = createProps({title, description, onClose, footer});

		const {getByText} = render(
			<IntlProvider locale="en">
				<DialogBox {...props}>Body</DialogBox>
			</IntlProvider>
		);

		expect(getByText('Body')).toBeTruthy();
		expect(getByText('Title')).toBeTruthy();
	});

	it('Should render close icon', () => {
		const title = 'Title';
		const description = <div> Body</div>;
		const footer = <div>Footer</div>;
		const onClose = jest.fn();

		const props = createProps({title, description, onClose, footer});

		const {getByTestId} = render(<DialogBox {...props} />);

		expect(getByTestId('closeIcon')).toBeTruthy();
	});

	it('Should trigger close button', () => {
		const title = 'Title';
		const description = <div>Body</div>;
		const footer = <div>Footer</div>;
		const noCallback = jest.fn();

		const props = createProps({title, description, noCallback, footer});
		expect(noCallback).not.toHaveBeenCalled();

		const {getByTestId} = render(
			<IntlProvider locale="en">
				<DialogBox {...props} />
			</IntlProvider>
		);

		const close = getByTestId('closeIcon');
		fireEvent.click(close);
	});
});
