import React, {Component} from 'react';

import NotFound from '../common/NotFound';

class RequestedParticipant extends Component {
	render() {
		const {contest} = this.props;
		if (!contest) {
			return <NotFound />;
		}

		return (
			<>
				<h5>Great!</h5>
				<p>
					You have requested access to be part of {contest.name}. Your request will be reviewed by
					the administrators shortly.
				</p>
			</>
		);
	}
}

export default RequestedParticipant;
