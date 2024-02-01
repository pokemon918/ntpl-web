import React, {FC, useState} from 'react';

import Checkbox from '../Checkbox';

import styles from './CheckboxGroup.module.scss';

interface OptionConfig {
	key: string;
	description: string;
	disabled?: boolean;
}

type Option = string | string[] | OptionConfig;

export interface Props {
	name: string;
	options: Option[];
	defaultValue?: string[];
	enableAllOption?: boolean;
	disabled?: boolean;
	onChange?: (selectedOptions: string[]) => void;
}

const CheckboxGroup: FC<Props> = ({
	name,
	options,
	defaultValue = [],
	enableAllOption,
	disabled,
	onChange,
}) => {
	const [value, setValue] = useState(defaultValue);
	const isAllChecked = value.length === options.length;

	const handleChange = (isChecked: boolean, id: string) => {
		if (isChecked && !value.includes(id)) {
			const optionAdded = [...value, id];
			setValue(optionAdded);
			onChange?.(optionAdded);
		} else if (!isChecked && value.includes(id)) {
			const optionRemoved = value.filter((item) => item !== id);
			setValue(optionRemoved);
			onChange?.(optionRemoved);
		}
	};

	const handleSelectAll = (isChecked: boolean) => {
		if (isChecked) {
			const selectAll = options.map((option) => getOptionKey(option));
			setValue(selectAll);
			onChange?.(selectAll);
		} else {
			setValue([]);
			onChange?.([]);
		}
	};

	return (
		<>
			{enableAllOption && (
				<>
					<Checkbox
						label="checkbox_all"
						small
						isChecked={isAllChecked}
						onChange={handleSelectAll}
					/>
					<hr className={styles.separator} />
				</>
			)}
			{options.map((option) => (
				<Checkbox
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

const isValueSelected = (value: string[], option: Option) => {
	return value.includes(getOptionKey(option));
};

export default CheckboxGroup;
