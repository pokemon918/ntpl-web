import React from 'react';

import Radio from './ui/Radio';

const RadioField = ({field, form, value, ...props}) => {
	const {name, value: currentValue} = field;
	const isChecked = currentValue === value;
	const handleChange = () => {
		form.setFieldValue(name, value);
	};
	return (
		<Radio {...field} {...props} value={value} isChecked={isChecked} onChange={handleChange} />
	);
};

export default RadioField;
