import React, {Component} from 'react';
import {connect} from 'react-redux';
import Back from './common/Back2Events';

import {contestConstants} from 'const';
import {fetchContest} from 'actions/contestActions';
import {
	makeContestInfoSelector,
	contestInfoIsLoadingSelector,
} from 'reducers/contestsReducer/contestInfoReducer';

import {getCurrentUserRole} from './common';
import NotFound from './common/NotFound';
import ContestAdmin from './roles/ContestAdmin';
import ContestTeamLeader from './roles/ContestTeamLeader';
import ContestMember from './roles/ContestMember';
import ContestParticipant from './roles/ContestParticipant';
import RequestedParticipant from './roles/RequestedParticipant';
import NonMember from './roles/NonMember';
import Spinner from 'components/shared/ui/Spinner';

import './contest.scss';

class Contest extends Component {
	onFetchContest = async () => {
		const {ref} = this.props.match.params;

		await this.props.fetchContest(ref);
	};

	componentDidMount() {
		this.onFetchContest();
	}

	getview(contest, user_relations) {
		const userRole = getCurrentUserRole(user_relations);

		if (userRole === contestConstants.relation.NOT_LOADED) {
			return <Spinner />;
		}

		if (userRole === contestConstants.relation.OWNER) {
			return <ContestAdmin contest={contest} />;
		}

		if (userRole === contestConstants.relation.LEADER) {
			return <ContestTeamLeader contest={contest} />;
		}

		if (userRole === contestConstants.relation.MEMBER) {
			return <ContestMember contest={contest} />;
		}

		if (userRole === contestConstants.relation.PARTICIPANT) {
			return <ContestParticipant contest={contest} />;
		}

		if (userRole === contestConstants.relation.REQUESTED_PARTICIPANT) {
			return <RequestedParticipant contest={contest} />;
		}

		if (userRole === contestConstants.relation.NONE) {
			return <NonMember contest={contest} onFetchContest={this.onFetchContest} />;
		}

		return 'Relation not found';
	}

	render() {
		const {contest, isLoading, serverUrl} = this.props;

		if (!contest) {
			return <NotFound />;
		}

		if (isLoading) {
			return <Spinner />;
		}

		const {
			contest: {user_relations},
		} = this.props;
		const contestImg = `${serverUrl}/images/${contest.avatar}`;

		return (
			<div class="contest">
				<Back />
				<div className="Contest_Header">
					<h1>{contest.name}</h1>
					{contest.avatar && <img src={contestImg} alt="Logo" height="100" width="100" />}
				</div>
				<p>{contest.description}</p>

				<hr className="extra-spacing" />
				{this.getview(contest, user_relations)}
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	const getContestInfo = makeContestInfoSelector();
	const contestRef = props.match.params.ref;

	return {
		contest: getContestInfo(state, {contestRef}),
		isLoading: contestInfoIsLoadingSelector(state),
		serverUrl: state.app.advancedOptions.serverUrl,
	};
}

export default connect(mapStateToProps, {fetchContest})(Contest);
