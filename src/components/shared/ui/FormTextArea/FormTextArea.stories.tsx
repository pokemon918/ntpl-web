import React from 'react';

import {FormDecorator} from 'stories/decorators';
import {FormTextArea} from 'components/shared/ui';

export default {
	title: 'UI Kit / Forms / Form Text Area',
	component: FormTextArea,
	decorators: [FormDecorator],
};

export const normal = () => (
	<FormTextArea name="foo" label="event_name" placeholder="event_enter_event_name" />
);
