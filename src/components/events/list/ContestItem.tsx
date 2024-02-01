import React from 'react';

import {ReactComponent as ChevronIcon} from './Icon_ChevronRight.svg';

const ContestItem = ({contest, onHandleChange, serverUrl}: any) => {
	const contestImg = `${serverUrl}/images/${contest.avatar}`;

	return (
		<div
			className="EventItem__Wrapper ContestItem__Wrapper"
			onClick={() => onHandleChange(contest)}
		>
			<div className="EventItem__Image">
				{contest.avatar && <img src={contestImg} alt="Logo" height="100" width="100" />}
			</div>
			<div className="EventItem__Details">
				<div className="EventItem__Context__Wrapper">
					<div className="EventList__Context">
						<div className="EventList__Context__Title">
							<b>{contest.name}</b>
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

export default ContestItem;
