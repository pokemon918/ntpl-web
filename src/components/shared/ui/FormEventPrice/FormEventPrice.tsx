import React, {FC} from 'react';
import {Controller, useFormContext} from 'react-hook-form';

import FormLabel from '../FormLabel';
import EventPrice from './EventPrice';

interface Props {
	name: string;
}

const FormEventPrice: FC<Props> = (baseProps) => {
	const {control} = useFormContext();
	const {name} = baseProps;

	return (
		<FormLabel label="event_field_price">
			<Controller name={name} control={control} as={<EventPrice {...baseProps} />} />
		</FormLabel>
	);
};

export default FormEventPrice;
