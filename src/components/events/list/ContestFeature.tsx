import React from 'react';
import dateFnsFormat from 'date-fns/format';
import {FaRegCalendar, FaMapMarkerAlt} from 'react-icons/fa';

const formatStyle: any = {
	fullDate: 'Do MMMM YYYY',
	fullTime: 'HH:mm',
	onlyDate: 'Do',
	onlyMonth: 'MMM',
};

const formatDate = (date: any, format: any) => {
	return dateFnsFormat(date || new Date(), formatStyle[format]);
};

export default ({contest, onHandleChange, serverUrl}: any) => {
	const startDate = formatDate(contest.start_date, 'fullDate');
	const contestImg = `${serverUrl}/images/${contest.avatar}`;

	return (
		<div className="EventFeature__Wrapper" onClick={() => onHandleChange(contest)}>
			<div className="EventItem__Wrapper">
				<div className="EventItem__Image">
					{contest.avatar && <img src={contestImg} alt="Logo" height="60" width="60" />}
				</div>
				<div className="EventItem__Details">
					<div className="EventItem__Context__Wrapper">
						<div className="EventList__Context">
							<div className="EventList__Context__Title">
								<b>{contest.name || ''}</b>
							</div>

							<div className="EventList__Context__Group">
								<span>{contest.sub_header}</span>
							</div>

							<div className="hide EventList__Context__Time">
								<div className="EventList__Date">
									<div className="EventFeature__Date">
										<FaRegCalendar /> {startDate}{' '}
										{/*startDate !== endDate && -{endDate}}
										{startTime} {startTime !== endTime && -{endTime}*/}
									</div>
									{contest.location && (
										<div className="EventList__Place">
											<FaMapMarkerAlt /> {contest.location}
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
