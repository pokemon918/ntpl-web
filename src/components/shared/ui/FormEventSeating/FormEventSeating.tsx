import React, {FC} from 'react';
import {Controller, useFormContext} from 'react-hook-form';

import FormLabel from '../FormLabel';
import EventSeating from './EventSeating';

interface Props {
	name: string;
}

const FormEventSeating: FC<Props> = (baseProps) => {
	const {control} = useFormContext();
	const {name} = baseProps;

	return (
		<FormLabel label="event_field_seating">
			<Controller name={name} control={control} as={<EventSeating {...baseProps} />} />
		</FormLabel>
	);
};

export default FormEventSeating;
