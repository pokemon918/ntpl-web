import React, {FC} from 'react';

import {FormRadioGroup} from 'components/shared/ui';

interface Props {
	name: string;
}

const eventVisibilityOptionsd = [
	['private', 'event_field_visibility_private'],
	['public', 'event_field_visibility_public'],
];

const FormEventVisibility: FC<Props> = ({name}) => (
	<FormRadioGroup
		label="event_field_visibility"
		description="event_field_visibility_description"
		name={name}
		options={eventVisibilityOptionsd}
	/>
);

export default FormEventVisibility;
