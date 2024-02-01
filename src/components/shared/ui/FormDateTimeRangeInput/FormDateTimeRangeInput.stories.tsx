import React from 'react';

import {FormDecorator} from 'stories/decorators';
import {FormDateTimeRangeInput} from 'components/shared/ui';

export default {
	title: 'UI Kit / Forms / Form Date Time Range Input',
	component: FormDateTimeRangeInput,
	decorators: [FormDecorator],
};

export const normal = () => (
	<FormDateTimeRangeInput name="datetime" label="event_field_date_and_time" />
);
