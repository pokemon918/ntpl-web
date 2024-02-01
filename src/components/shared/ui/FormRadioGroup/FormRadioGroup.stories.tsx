import React from 'react';

import {FormDecorator} from 'stories/decorators';
import {FormRadioGroup} from 'components/shared/ui';

export default {
	title: 'UI Kit / Forms / Form Radio Group',
	component: FormRadioGroup,
	decorators: [FormDecorator],
};

const radioOptions = [
	['free', 'Free'],
	['freemium', 'Freemium'],
	['priced', 'Priced'],
];

export const normal = () => (
	<FormRadioGroup name="price" label="event_price" options={radioOptions} />
);
