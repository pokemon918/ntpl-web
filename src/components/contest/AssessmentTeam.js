import React, {Component} from 'react';

import './contest.scss';
import assessment from './assessment.png';
import Back from './common/Back';

class AssessmentTeam extends Component {
	render() {
		return (
			<div class="contest">
				<Back />
				<h1>Team Assessment</h1>
				<img src={assessment} alt="assessment" width="100%" height="100%" />
			</div>
		);
	}
}

export default AssessmentTeam;
