import React, {FC} from 'react';

import {FormLabel} from 'components/shared/ui';
import {Controller, useFormContext} from 'react-hook-form';
import DateTimeRangeInput from '../DateTimeRangeInput';

interface Props {
	name: string;
	label: string;
}

const FormDateRange: FC<Props> = (props) => {
	const {control} = useFormContext();
	const {name, label, ...baseProps} = props;

	return (
		<FormLabel label={label}>
			<Controller name={name} control={control} as={<DateTimeRangeInput {...baseProps} />} />
		</FormLabel>
	);
};

export default FormDateRange;
