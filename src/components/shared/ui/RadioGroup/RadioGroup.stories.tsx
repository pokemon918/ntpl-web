import React from 'react';

import {RadioGroup} from 'components/shared/ui';

export default {
	title: 'UI Kit / Inputs / Radio Group',
	component: RadioGroup,
};

const radioOptions = [
	['free', 'Free'],
	['freemium', 'Freemium'],
	['priced', 'Priced'],
];

const radioWithOptionDisabled = [
	['regular_tasting', 'Regular Tasting'],
	{
		key: 'blind_tasting',
		description: 'Blind Tasting',
		disabled: true,
	},
];

export const normal = () => <RadioGroup name="price" options={radioOptions} />;

export const defaultValue = () => (
	<RadioGroup name="price" options={radioOptions} defaultValue="priced" />
);

export const disabled = () => <RadioGroup name="price" options={radioOptions} disabled />;

export const optionDisabled = () => (
	<RadioGroup name="tasting_type" options={radioWithOptionDisabled} />
);
