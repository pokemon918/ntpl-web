import React, {FC, ChangeEvent, useState} from 'react';
import classNames from 'classnames';

import {getFormattedDate} from 'commons/commons';
import styles from './DateInput.module.scss';

interface Props {
	defaultValue?: string;
	placeholder?: string;
	onChange?: (date: string) => void;
}

const DateInput: FC<Props> = ({defaultValue, placeholder = 'Select date', onChange}) => {
	const [value, setValue] = useState(defaultValue);

	const formattedDate = getFormattedDate(value);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const {value} = event.target;
		setValue(value);
		onChange?.(value);
	};

	return (
		<label className={styles.container}>
			<div className={styles.input}>
				<span className={classNames(styles.text, {[styles.placeholder]: !formattedDate})}>
					{formattedDate || placeholder}
				</span>
			</div>
			<input
				type="date"
				defaultValue={defaultValue}
				onChange={handleChange}
				className={styles.value}
			/>
		</label>
	);
};

export default DateInput;
