import React from 'react';

import Dropdown from './ui/Dropdown';
import FieldErrorTooltip from './FieldErrorTooltip';

const DropdownField = ({field, form, ...props}) => {
	const handleChange = (item) => {
		const {name} = field;
		const value = item[props.valueKey];
		form.setFieldValue(name, value);
	};
	return (
		<FieldErrorTooltip name={field.name}>
			<Dropdown {...field} {...props} value={field.value} onSelectItem={handleChange} />
		</FieldErrorTooltip>
	);
};

export default DropdownField;
