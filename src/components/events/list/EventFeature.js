import React from 'react';
import {getDate} from 'date-fns';
import dateFnsFormat from 'date-fns/format';
import {FaRegClock, FaMapMarkerAlt} from 'react-icons/fa';

const formatStyle = {
	fullDate: 'Do MMMM YYYY',
	fullTime: 'HH:mm',
	onlyDate: 'Do',
	onlyMonth: 'MMM',
};

const formatDate = (date, format) => {
	return dateFnsFormat(date, formatStyle[format]);
};

const EventFeature = ({event, onHandleChange}) => {
	const startTime = formatDate(event.collection.start_date, 'fullTime');

	return (
		<div className="EventFeature__Wrapper" onClick={() => onHandleChange(event.collection)}>
			<div className="EventItem__Wrapper">
				<div className="EventItem__Date">
					<div className="EventItem__Day">{getDate(event.collection.start_date)}</div>
					<div className="EventItem__Month">
						{formatDate(event.collection.start_date, 'onlyMonth')}
					</div>
				</div>
				<div className="EventItem__Details">
					<div className="EventItem__Context__Wrapper">
						<div className="EventList__Context">
							<div className="EventList__Context__Title">
								<b>{event.collection.name || 'Featured Event'}</b>
							</div>
							<div className="EventList__Context__Group">
								<span> {event.sub_header}</span>
							</div>
							<div className="EventList__Context__Time">
								<div className="EventList__Date">
									<div className="EventFeature__Date">
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventFeature;
