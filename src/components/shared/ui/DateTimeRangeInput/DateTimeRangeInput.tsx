import React, {FC, useState} from 'react';

import DateTimeInput from '../DateTimeInput';
import styles from './DateTimeRangeInput.module.scss';

interface Props {
	defaultValue?: [string, string];
	onChange?: (dateTimeRange: [string, string]) => void;
}

const DateTimeRangeInput: FC<Props> = ({defaultValue = ['', ''], onChange}) => {
	const [defaultStartDate, defaultEndDate] = defaultValue;
	const [[startDate, endDate], setValue] = useState(defaultValue);

	const handleStartDateChange = (newStartDate: string) => {
		setValue([newStartDate, endDate]);
		onChange?.([newStartDate, endDate]);
	};

	const handleEndDateChange = (newEndDate: string) => {
		setValue([startDate, newEndDate]);
		onChange?.([startDate, newEndDate]);
	};

	return (
		<div className={styles.container}>
			<dd>Starts on</dd>
			<dl>
				<DateTimeInput defaultValue={defaultStartDate} onChange={handleStartDateChange} />
			</dl>
			<dd>Ends on</dd>
			<dl>
				<DateTimeInput defaultValue={defaultEndDate} onChange={handleEndDateChange} />
			</dl>
		</div>
	);
};

export default DateTimeRangeInput;
