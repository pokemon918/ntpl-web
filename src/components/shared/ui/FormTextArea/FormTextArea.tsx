import React, {FC} from 'react';

import {FormLabel} from 'components/shared/ui';
import TextArea from 'components/shared/ui/TextArea';
import {useFormContext} from 'react-hook-form';

interface Props {
	name: string;
	label: string;
	placeholder?: string;
}

const FormTextArea: FC<Props> = ({name, label, placeholder}) => {
	const {register} = useFormContext();

	return (
		<FormLabel label={label}>
			<TextArea ref={register} name={name} infoKey={label} placeholder={placeholder} />
		</FormLabel>
	);
};

export default FormTextArea;
