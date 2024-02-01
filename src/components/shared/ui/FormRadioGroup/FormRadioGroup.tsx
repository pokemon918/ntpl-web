import React, {FC} from 'react';
import {useFormContext, Controller} from 'react-hook-form';

import {FormLabel, RadioGroup} from 'components/shared/ui';
import {Props as BaseProps} from 'components/shared/ui/RadioGroup/RadioGroup';

interface Props extends BaseProps {
	label: string;
	description?: string;
}

const FormRadioGroup: FC<Props> = ({label, description, ...baseProps}) => {
	const {control} = useFormContext();
	const {name} = baseProps;

	return (
		<FormLabel label={label} description={description}>
			<Controller name={name} control={control} as={<RadioGroup {...baseProps} />} />
		</FormLabel>
	);
};

export default FormRadioGroup;
