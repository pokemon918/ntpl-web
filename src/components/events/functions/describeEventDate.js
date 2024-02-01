import {format, parse} from 'date-fns';

function describeEventDate(event) {
	const getDateParts = (date) => format(parse(date), 'YYYY-MMMM-D').split('-');

	const [startYear, startMonth, startDay] = getDateParts(event.feature_start);
	const [endYear, endMonth, endDay] = getDateParts(event.feature_end);

	if (startYear !== endYear) {
		const startText = `${startDay} ${startMonth} ${startYear}`;
		const endText = `${endDay} ${endMonth} ${endYear}`;
		return `${startText} - ${endText}`;
	}

	if (startMonth !== endMonth) {
		const startText = `${startDay} ${startMonth}`;
		const endText = `${endDay} ${endMonth}`;
		return `${startText} - ${endText} ${endYear}`;
	}

	if (startDay !== endDay) {
		return `${startDay}-${endDay} ${endMonth} ${endYear}`;
	}

	return `${endDay} ${endMonth} ${endYear}`;
}

export default describeEventDate;
