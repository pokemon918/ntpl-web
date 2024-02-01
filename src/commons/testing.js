import React from 'react';
import {render} from '@testing-library/react';
import {IntlProvider} from 'react-intl';

export function renderWithIntl(children) {
	const {rerender, ...others} = render(<IntlProvider locale="en">{children}</IntlProvider>);

	function rerenderWithIntl(rerenderChildren) {
		rerender(<IntlProvider locale="en">{rerenderChildren}</IntlProvider>);
	}

	return {rerender: rerenderWithIntl, ...others};
}
