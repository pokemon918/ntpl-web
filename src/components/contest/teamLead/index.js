import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FaSync} from 'react-icons/fa';

import Grid from 'components/shared/ui/Grid';
import Back from '../common/BackFour';
import {contestConstants} from 'const';
import Button from 'components/shared/ui/Button';
import NotFound from '../common/NotFound';
import PageUnavailable from '../common/PageUnavailable';
import Spinner from 'components/shared/ui/Spinner';
import ContestTeamWrapper from './ContestTeamWrapper';
import {fetchContest, fetchContestTeamLeader, updateContestStatement} from 'actions/contestActions';
import {getCurrentUserRole} from '../common';
import {
	contestLoadingStateSelector,
	contestLoadingStatementSelector,
	contestTeamLeaderLoadingSelector,
} from 'reducers/contestReducer';
import {makeContestInfoSelector} from 'reducers/contestsReducer/contestInfoReducer';

import '../contest.scss';
import {makeContestTeamLeadSelector} from 'reducers/contestsReducer/contestTeamLeadReducer';

class TeamLeader extends Component {
	onFetchContestTeam = () => {
		const {ref, collection, teamRef} = this.props.match.params;

		this.props.fetchContestTeamLeader(ref, collection, teamRef);
	};

	onFetchContest = () => {
		const {ref} = this.props.match.params;

		this.props.fetchContest(ref);
	};

	async componentDidMount() {
		const {contest} = this.props;
		if (!contest) {
			return await this.onFetchContest();
		}
		const userRole = getCurrentUserRole(contest && contest.user_relations);

		if (userRole === contestConstants.relation.LEADER) {
			this.onFetchContestTeam();
		}
	}

	componentWillReceiveProps(nextProps) {
		const {teamLeader, contest} = nextProps;

		if (!teamLeader) {
			if (contest && contest.user_relations.includes(contestConstants.relation.LEADER)) {
				this.onFetchContestTeam();
			}
		}
	}

	render() {
		const {contest, teamLeader, loadingState, updateContestStatement} = this.props;

		if (loadingState === 'pending') {
			return <Spinner />;
		}

		if (!contest) {
			return <NotFound />;
		}

		const userRole = getCurrentUserRole(contest && contest.user_relations);

		if (userRole !== contestConstants.relation.LEADER) {
			return <PageUnavailable />;
		}

		let info = '';

		info = {collection: null, team: null, subjects: null};
		if (teamLeader) {
			info = {collection: null, team: null, subjects: null, ...teamLeader};
		}

		const contestInfo = contest?.collections.find((col) => col?.ref === info?.collection?.ref);
		const isRound2 = contestInfo?.metadata?.swa_round_2;

		return (
			<>
				<Grid columns={12}>
					<div className="contest contest-leader-dashboard">
						<Back />
						<Button
							className="corner-button"
							variant="outlined"
							size="small"
							onHandleClick={this.onFetchContestTeam}
						>
							Refresh <FaSync />
						</Button>
						{info.collection && (
							<>
								<h1>{info.collection.name}</h1>
								{info.collection.theme && <h3> {info.collection.theme}</h3>}
								<p>Assessment by {info.team.name}</p>
								<hr />
								{info.subjects && (
									<ContestTeamWrapper
										loadingStatement={this.props.loadingStatementState}
										loadingTeamLeader={this.props.loadingTeamLeader}
										isRound2={isRound2}
										updateContestStatement={updateContestStatement}
										onFetchContestTeam={this.onFetchContestTeam}
										subjects={info.subjects}
										impressions={info.impression}
										participants={contest && contest.participants}
									/>
								)}
							</>
						)}
					</div>
				</Grid>
			</>
		);
	}
}

function mapStateToProps(state, props) {
	const getContestInfo = makeContestInfoSelector();
	const getTeamLead = makeContestTeamLeadSelector();
	const {ref: contestRef, collection: collectionRef, teamRef} = props.match.params;

	return {
		contest: getContestInfo(state, {contestRef}),
		loadingState: contestLoadingStateSelector(state),
		loadingStatementState: contestLoadingStatementSelector(state),
		loadingTeamLeader: contestTeamLeaderLoadingSelector(state),
		teamLeader: getTeamLead(state, {contestRef, collectionRef, teamRef}),
	};
}

export default connect(mapStateToProps, {
	fetchContest,
	fetchContestTeamLeader,
	updateContestStatement,
})(TeamLeader);
