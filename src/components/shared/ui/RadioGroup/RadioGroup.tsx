import React, {FC, useState, ChangeEvent} from 'react';

import Radio from 'components/shared/ui/Radio';

interface OptionConfig {
	key: string;
	description: string;
	disabled?: boolean;
}

type Option = string | string[] | OptionConfig;

export interface Props {
	name: string;
	options: Option[];
	defaultValue?: string;
	disabled?: boolean;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroup: FC<Props> = ({name, options, defaultValue, disabled, onChange}) => {
	const [value, setValue] = useState(defaultValue);

	const handleChange = (value: string, event: ChangeEvent<HTMLInputElement>) => {
		setValue(value);
		onChange?.(event);
	};

	return (
		<>
			{options.map((option) => (
				<Radio
					name={name}
					id={getOptionKey(option)}
					label={getOptionDescription(option)}
					disabled={disabled || isOptionDisabled(option)}
					isChecked={isValueSelected(value, option)}
					onChange={handleChange}
					small
				/>
			))}
		</>
	);
};

const getOptionKey = (option: Option) => {
	if (typeof option === 'string') {
		return option;
	}

	if (typeof option === 'object' && Array.isArray(option)) {
		const [key] = option;
		return key;
	}

	if (typeof option === 'object') {
		return option.key;
	}

	return '';
};

const getOptionDescription = (option: Option) => {
	if (typeof option === 'string') {
		return option;
	}

	if (typeof option === 'object' && Array.isArray(option)) {
		const [, description] = option;
		return description;
	}

	if (typeof option === 'object') {
		return option.description;
	}

	return '';
};

const isOptionDisabled = (option: Option) => {
	if (typeof option === 'object' && !Array.isArray(option)) {
		return option.disabled;
	}

	return undefined;
};

const isValueSelected = (value: string | undefined, option: Option) => {
	return value === getOptionKey(option);
};

export default RadioGroup;
