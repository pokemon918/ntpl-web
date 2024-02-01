import React, {FC, useState} from 'react';
import formatDate from 'date-fns/format';
import parseDate from 'date-fns/parse';

import {DateInput, TimeInput} from 'components/shared/ui';

import styles from './DateTimeInput.module.scss';

const splitDateTime = (value?: string) => {
	if (!value) {
		return ['', ''];
	}

	const parsedValue = parseDate(value);
	if (!parsedValue) {
		return ['', ''];
	}

	const date = formatDate(parsedValue, 'YYYY/MM/DD');
	const time = formatDate(parsedValue, 'HH:mm');
	return [date, time];
};

const joinDateTime = (date: string, time: string) => {
	return [date, time].join(' ');
};

interface Props {
	defaultValue?: string;
	onChange?: (dateTime: string) => void;
}

const DateTimeInput: FC<Props> = ({defaultValue, onChange}) => {
	const [defaultDate, defaultTime] = splitDateTime(defaultValue);
	const [[date, time], setValue] = useState([defaultDate, defaultTime]);

	const handleDateChange = (newDate: string) => {
		setValue([newDate, time]);
		onChange?.(joinDateTime(newDate, time));
	};

	const handleTimeChange = (newTime: string) => {
		setValue([date, newTime]);
		onChange?.(joinDateTime(date, newTime));
	};

	return (
		<div>
			<DateInput defaultValue={defaultDate} onChange={handleDateChange} />
			<span className={styles.separator}>at</span>
			<TimeInput defaultValue={defaultTime} onChange={handleTimeChange} />
		</div>
	);
};

export default DateTimeInput;
