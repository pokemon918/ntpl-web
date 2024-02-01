import React from 'react';

import {FormCheckboxGroup} from 'components/shared/ui';
import {FormDecorator} from 'stories/decorators';

export default {
	title: 'UI Kit / Forms / Form Checkbox Group',
	component: FormCheckboxGroup,
	decorators: [FormDecorator],
};

const checkboxOptions = [
	['quick_tasting', 'Quick tasting'],
	['profound_tasting', 'Profound tasting'],
	['wset_level_2', 'WSET level 2'],
	['wset_level_3', 'WSET level 3'],
	['wset_level_4', 'WSET level 4'],
];

export const normal = () => (
	<FormCheckboxGroup name="tasting_tools" label="event_tasting_tools" options={checkboxOptions} />
);
