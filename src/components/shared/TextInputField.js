import React from 'react';

import TextInput from './ui/TextInput';
import FieldErrorTooltip from './FieldErrorTooltip';

const TextInputField = ({field, form, ...props}) => {
	const handleChange = (value) => {
		const {name} = field;
		form.setFieldValue(name, value);
	};
	return (
		<FieldErrorTooltip name={field.name}>
			<TextInput {...field} {...props} onChange={handleChange} />
		</FieldErrorTooltip>
	);
};

export default TextInputField;
