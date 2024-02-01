import React from 'react';
import dateFnsFormat from 'date-fns/format';
import {getDate} from 'date-fns';
import {FaRegClock, FaMapMarkerAlt} from 'react-icons/fa';

import {ReactComponent as ChevronIcon} from './Icon_ChevronRight.svg';

const formatStyle = {
	fullDate: 'Do MMMM YYYY',
	fullTime: 'HH:mm',
	onlyMonth: 'MMM',
};

const visibility = {
	open: 'Public',
	private: 'Private',
};

const formatDate = (date, format) => {
	return dateFnsFormat(date, formatStyle[format]);
};

const EventItem = ({event, onHandleChange}) => {
	const startTime = formatDate(event.start_date, 'fullTime');

	return (
		<div className="EventItem__Wrapper" onClick={() => onHandleChange(event)}>
			<div className="EventItem__Date">
				<div className="EventItem__Day">{getDate(event.start_date)}</div>
				<div className="EventItem__Month">{formatDate(event.start_date, 'onlyMonth')}</div>
			</div>
			<div className="EventItem__Details">
				<div className="EventItem__Context__Wrapper">
					<div className="EventList__Context">
						<div className="EventList__Context__Title">
							<b>{event.name}</b>
						</div>
						<div className="EventList__Context__Group">
							{visibility[event.visibility]} event by <span> SWA</span>
						</div>
						<div className="EventList__Context__Time">
							<div className="EventList__Date">
								<FaRegClock /> {startTime}{' '}
								{/*startDate !== endDate && -{endDate}}
								{startTime} {startTime !== endTime && -{endTime}*/}
							</div>
							{event.location && (
								<div className="EventList__Place">
									<FaMapMarkerAlt /> {event.location}
								</div>
							)}
						</div>
					</div>
					<div className="EventList__Context__Chevron">
						<ChevronIcon />
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventItem;
