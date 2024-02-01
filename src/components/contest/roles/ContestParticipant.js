import React, {Component} from 'react';

import NotFound from '../common/NotFound';

class ContestParticipant extends Component {
	render() {
		const {contest} = this.props;
		if (!contest) {
			return <NotFound />;
		}

		return (
			<p>
				You have been approved to join {contest.name}. As soon as you have been assigned to a team
				you will be able to see the information on this page.
			</p>
		);
	}
}

export default ContestParticipant;
