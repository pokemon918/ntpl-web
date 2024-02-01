import React from 'react';
import {IntlProvider} from 'react-intl';
import {cleanup, fireEvent, render} from '@testing-library/react';

import Modal from './index';

const createProps = ({title, body, onClose, footer} = {}) => ({
	body,
	title,
	footer,
	onClose,
});

describe('Modal componenet', () => {
	afterEach(cleanup);

	it('Modal should render without crashing', () => {
		const title = 'Title';
		const body = <div> Body</div>;
		const footer = <div>Footer</div>;
		const onClose = jest.fn();

		const props = createProps({title, body, onClose, footer});

		const {container} = render(<Modal {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Should render correct value', () => {
		const title = 'Title';
		const body = <div> Body</div>;
		const footer = <div>Footer</div>;
		const onClose = jest.fn();

		const props = createProps({title, body, onClose, footer});

		const {getByText} = render(<Modal {...props} />);

		expect(getByText('Body')).toBeTruthy();
		expect(getByText('Title')).toBeTruthy();
	});

	it('Should render close icon', () => {
		const title = 'Title';
		const body = <div> Body</div>;
		const footer = <div>Footer</div>;
		const onClose = jest.fn();

		const props = createProps({title, body, onClose, footer});

		const {getByAltText} = render(
			<IntlProvider locale="en">
				<Modal {...props} />
			</IntlProvider>
		);

		expect(getByAltText('close-icon')).toBeTruthy();
	});

	it('Should trigger close button', () => {
		const title = 'Title';
		const body = <div> Body</div>;
		const footer = <div>Footer</div>;
		const onClose = jest.fn();

		const props = createProps({title, body, onClose, footer});
		expect(onClose).not.toHaveBeenCalled();

		const {getByAltText} = render(
			<IntlProvider locale="en">
				<Modal {...props} />
			</IntlProvider>
		);

		const close = getByAltText('close-icon');
		fireEvent.click(close);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('Should render footer', () => {
		const title = 'Title';
		const body = <div> Body</div>;
		const footer = <div>Footer</div>;
		const onClose = jest.fn();

		const props = createProps({title, body, onClose, footer});

		const {getByText} = render(<Modal {...props} />);

		expect(getByText('Footer')).toBeTruthy();
	});
});
