import React, {Component} from 'react';
import {connect} from 'react-redux';

import './contest.scss';
import Back from './common/Back';
import NotFound from './common/NotFound';
import TeamContest from './arrival/Teams';
import {contestConstants} from 'const';
import Button from 'components/shared/ui/Button';
import Participants from './arrival/Participants';
import {fetchContest, updateContestTeam, updateContestRole} from 'actions/contestActions';
import {makeContestInfoSelector} from 'reducers/contestsReducer/contestInfoReducer';
import PageUnavailable from './common/PageUnavailable';
import {getCurrentUserRole, sortByName} from './common';
import {FaSync} from 'react-icons/fa';

class Distribution extends Component {
	onBack = () => {
		this.props.history.goBack();
	};

	onFetchContest = () => {
		const {ref} = this.props.match.params;

		this.props.fetchContest(ref);
	};

	onUpdateTeam = (item, teamId) => {
		const {ref} = this.props.match.params;

		this.props.updateContestTeam(ref, item.ref, teamId, item.division);
	};

	onUpdateRole = (participant, role) => {
		const {ref} = this.props.match.params;

		this.props.updateContestRole(ref, participant.ref, role.id);
	};

	componentDidMount() {
		this.onFetchContest();
	}

	render() {
		const {contest} = this.props;
		if (!contest) {
			return <NotFound />;
		}

		const userRole = getCurrentUserRole(contest && contest.user_relations);

		if (userRole !== contestConstants.relation.OWNER) {
			return <PageUnavailable />;
		}

		return (
			<div class="contest">
				<Back />
				<div className="Contest_Header">
					<h1>Team distribution for {contest.name} </h1>
					<Button
						className="corner-button"
						variant="outlined"
						size="small"
						onHandleClick={this.onFetchContest}
					>
						Refresh <FaSync />
					</Button>{' '}
				</div>

				{!!contest?.participants?.filter(
					(item) => !item.division && item.metadata?.confirmed_arrival
				).length && (
					<>
						<h3>Participants with confirmed arrival time</h3>
						<Participants
							name={contest.name}
							onUpdateTeam={this.onUpdateTeam}
							teams={contest.teams}
							columns={['Name', 'Email', 'Team', 'Arrival confirmed']}
							participants={contest.participants}
						/>
					</>
				)}
				<div className="ContestArrival__Wrapper">
					<table>
						<thead></thead>
						{contest.teams &&
							contest.teams.sort(sortByName).map((team) => (
								<>
									<tbody>
										<tr>
											<td colspan="5" style={{padding: '75px 0 5px 0'}}>
												<h4>{team.name}</h4>
											</td>
										</tr>
									</tbody>
									<TeamContest
										name={contest.name}
										team={team}
										alias={contest.alias}
										teams={contest.teams}
										onUpdateTeam={this.onUpdateTeam}
										onUpdateRole={this.onUpdateRole}
										columns={['Email', 'Team', 'Role', 'Arrival confirmed']}
										participants={contest.participants}
									/>
								</>
							))}
					</table>
				</div>
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

export default connect(mapStateToProps, {fetchContest, updateContestTeam, updateContestRole})(
	Distribution
);
