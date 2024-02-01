import React from 'react';
import {IntlProvider} from 'react-intl';
import {cleanup, fireEvent, render, waitForElement} from '@testing-library/react';

import Accordion from './index';

const createProps = ({children, expandText, collapseText} = {}) => ({
	children,
	expandText,
	collapseText,
});

describe('Accordion componenet', () => {
	afterEach(cleanup);

	it('Accordion should render without crashing', () => {
		const children = <div> Test</div>;
		const expandText = 'Expanded';
		const collapseText = 'Collapse';

		const onSelect = jest.fn();

		const props = createProps({children, expandText, collapseText});

		const {container} = render(
			<IntlProvider locale="en">
				<Accordion {...props} />
			</IntlProvider>
		);

		expect(container.firstChild).toBeTruthy();
	});

	it('Accordion should be collapsed by default', () => {
		const children = <div> Test</div>;
		const expandText = 'Expanded';
		const collapseText = 'Collapsed';

		const props = createProps({children, expandText, collapseText});

		const {getByText} = render(
			<IntlProvider locale="en">
				<Accordion {...props} />
			</IntlProvider>
		);

		expect(getByText(/Collapsed/)).toBeTruthy();
	});

	it('Accordion should toggle on click', async () => {
		const children = <div> Test</div>;
		const expandText = 'Expanded';
		const collapseText = 'Collapsed';
		const props = createProps({children, expandText, collapseText});

		const {getByText} = render(
			<IntlProvider locale="en">
				<Accordion {...props} />
			</IntlProvider>
		);

		const downElement = getByText('Icon_ChevronDown.svg');
		fireEvent.click(downElement.firstChild);

		expect(getByText(/Expanded/)).toBeTruthy();

		const upElement = getByText('Icon_ChevronUp.svg');
		fireEvent.click(upElement.firstChild);

		await waitForElement(() => getByText(/Collapsed/));
		expect(getByText(/Collapsed/)).toBeTruthy();
	});
});
