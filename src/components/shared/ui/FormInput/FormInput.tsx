import React, {FC} from 'react';

import {FormLabel} from 'components/shared/ui';
import TextInput from 'components/shared/ui/TextInput';
import {useFormContext} from 'react-hook-form';

interface Props {
	name: string;
	label: string;
	placeholder?: string;
	defaultValue?: string;
	readonly?: boolean;
}

const FormInput: FC<Props> = ({name, label, placeholder}) => {
	const {register} = useFormContext();

	return (
		<FormLabel label={label}>
			<TextInput innerRef={register} name={name} placeholder={placeholder} />
		</FormLabel>
	);
};

export default FormInput;
