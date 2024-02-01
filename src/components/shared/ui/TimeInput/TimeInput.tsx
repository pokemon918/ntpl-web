import React, {FC, ChangeEvent, useState} from 'react';
import InputMask from 'react-input-mask';

import styles from './TimeInput.module.scss';

interface Props {
	defaultValue?: string;
	placeholder?: string;
	onChange?: (date: string) => void;
}

const TimeInput: FC<Props> = ({defaultValue, placeholder = '00:00', onChange}) => {
	const [, setValue] = useState(defaultValue);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const {value} = event.target;
		setValue(value);
		onChange?.(value);
	};

	return (
		<label className={styles.container}>
			<InputMask
				mask="99:99"
				defaultValue={defaultValue}
				onChange={handleChange}
				placeholder={placeholder}
				className={styles.input}
			/>
		</label>
	);
};

export default TimeInput;
