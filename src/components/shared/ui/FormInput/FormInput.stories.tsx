import React from 'react';

import {FormDecorator} from 'stories/decorators';
import {FormInput} from 'components/shared/ui';

export default {
	title: 'UI Kit / Forms / Form Input',
	component: FormInput,
	decorators: [FormDecorator],
};

export const normal = () => (
	<FormInput name="foo" label="event_name" placeholder="event_enter_event_name" />
);
