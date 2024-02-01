import React from 'react';

import {FormDecorator} from 'stories/decorators';
import {CheckboxGroup} from 'components/shared/ui';
import {action} from '@storybook/addon-actions';

export default {
	title: 'UI Kit / Inputs / Checkbox Group',
	component: CheckboxGroup,
};

const checkboxOptions = [
	['quick_tasting', 'Quick tasting'],
	['profound_tasting', 'Profound tasting'],
	['wset_level_2', 'WSET level 2'],
	['wset_level_3', 'WSET level 3'],
	['wset_level_4', 'WSET level 4'],
];

const checkboxWithOptionDisabled = [
	{
		key: 'wine_name',
		description: 'Alias for wine name',
		disabled: true,
	},
	['vintage', 'Vintage'],
	['producer', 'Producer'],
	['country', 'Country'],
	['region', 'Region'],
	['appellation', 'Appellation'],
];

export const normal = () => (
	<CheckboxGroup name="tasting_tools" options={checkboxOptions} onChange={action('Changed')} />
);

export const defaultValue = () => (
	<CheckboxGroup
		name="tasting_tools"
		options={checkboxOptions}
		defaultValue={['quick_tasting', 'profound_tasting']}
		onChange={action('Changed')}
	/>
);

export const enableAllOption = () => (
	<CheckboxGroup
		name="tasting_tools"
		options={checkboxOptions}
		enableAllOption
		defaultValue={['quick_tasting', 'profound_tasting']}
		onChange={action('Changed')}
	/>
);

export const disabled = () => (
	<CheckboxGroup name="tasting_tools" options={checkboxOptions} disabled />
);

export const optionDisabled = () => (
	<CheckboxGroup
		name="blind_tasting_visibility"
		options={checkboxWithOptionDisabled}
		defaultValue={['wine_name']}
		onChange={action('Changed')}
	/>
);
