import React, {FC} from 'react';
import {useFormContext, Controller} from 'react-hook-form';

import {CheckboxGroup, FormLabel} from 'components/shared/ui';
import {Props as BaseProps} from 'components/shared/ui/CheckboxGroup/CheckboxGroup';

interface Props extends BaseProps {
	label: string;
}

const FormCheckboxGroup: FC<Props> = ({label, ...baseProps}) => {
	const {control} = useFormContext();
	const {name} = baseProps;

	return (
		<FormLabel label={label}>
			<Controller name={name} control={control} as={<CheckboxGroup {...baseProps} />} />
		</FormLabel>
	);
};

export default FormCheckboxGroup;
