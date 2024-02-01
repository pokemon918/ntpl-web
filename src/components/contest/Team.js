import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchContest} from 'actions/contestActions';
import {makeContestInfoSelector} from 'reducers/contestsReducer/contestInfoReducer';
import NotFound from './common/NotFound';

class Team extends Component {
	onFetchContest = () => {
		const {ref} = this.props.match.params;

		this.props.fetchContest(ref);
	};

	componentDidMount() {
		this.onFetchContest();
	}

	render() {
		const {contest} = this.props;
		if (!contest) {
			return <NotFound />;
		}

		const {
			contest: {name, description},
		} = this.props;

		return (
			<div className="contest">
				<h1>{name}</h1>
				<p>{description}</p>
				moved to ContestTeamLeader.js
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	const getContestInfo = makeContestInfoSelector();
	const contestRef = props.match.params.ref;

	return {
		contest: getContestInfo(state, {contestRef}),
	};
}

export default connect(mapStateToProps, {fetchContest})(Team);
