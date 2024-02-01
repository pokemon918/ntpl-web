import React, {Component, useState} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import dateFnsFormat from 'date-fns/format';
import {FaCheck, FaRegTimesCircle} from 'react-icons/fa';

import Back from './common/Back';
import PageUnavailable from './common/PageUnavailable';
import NotFound from './common/NotFound';
import Spinner from 'components/shared/ui/Spinner';
import Button from 'components/shared/ui/Button';
import {
	fetchContest,
	onAcceptUser,
	fetchRequestForContest,
	updateParticipantMetadata,
	rejectContestRequest,
} from 'actions/contestActions';
import {
	makeContestInfoSelector,
	contestInfoIsLoadingSelector,
	teamNamesSelector,
} from 'reducers/contestsReducer/contestInfoReducer';
import DialogBox from 'components/shared/ui/DialogBox';
import {contestConstants} from 'const';
import {getCurrentUserRole} from './common';
import {FaSync} from 'react-icons/fa';

import './contest.scss';
import './ContestArrival.scss';
import {makeContestJoinRequestSelector} from 'reducers/contestsReducer/contestJoinRequest';

const RejectModal = ({user, contest, onHideModal, onRejectUser}) => (
	<DialogBox
		title={'Are you sure?'}
		description={
			<>
				<p>
					You are about to reject the request to let <b>{user}</b> be part of <b>{contest}</b>.
				</p>
				<br />
				<p>Are you sure you would like to reject this?</p>
			</>
		}
		noCallback={onHideModal}
		yesCallback={onRejectUser}
	/>
);

class Arrival extends Component {
	state = {
		error: false,
		showRejectModal: false,
	};

	onBack = () => {
		this.props.history.goBack();
	};

	onHideModal = () => {
		this.setState({showRejectModal: false});
	};

	onRequest = async (userRef) => {
		const {ref} = this.props.match.params;
		await this.props.onAcceptUser(ref, userRef);
		this.onFetchContest();
	};

	onRejectUser = async (teamRef, id) => {
		const {ref} = this.props.match.params;
		await this.props.rejectContestRequest(ref, teamRef, id);
		this.onHideModal();
		this.onFetchContest();
	};

	onFetchContest = () => {
		const {ref} = this.props.match.params;

		this.props.fetchRequestForContest(ref);
	};

	async componentDidMount() {
		const {ref} = this.props.match.params;
		const {contest} = this.props;

		if (!contest) {
			await this.props.fetchContest(ref);
		}

		const userRole = getCurrentUserRole(contest && contest.user_relations);
		if (userRole === contestConstants.relation.OWNER) {
			this.props.fetchRequestForContest(ref);
		}
	}

	render() {
		const {listRequestsJoin = [], isLoading, teamNames, contest} = this.props;
		const {ref: contestRef} = this.props.match.params;
		const {error, showRejectModal} = this.state;

		if (isLoading) {
			return <Spinner />;
		}

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
					<h1>Approve and Arrival</h1>
					<Button
						className="corner-button"
						variant="outlined"
						size="small"
						onHandleClick={this.onFetchContest}
					>
						Refresh <FaSync />
					</Button>{' '}
				</div>
				{isLoading && <Spinner />}

				{error && (
					<DialogBox
						title={'error_title'}
						errorBox={true}
						description={`Error while sending the request. Please try again in a moment`}
						noCallback={() => this.setState({error: false})}
					/>
				)}
				<hr className="extra-spacing" />
				<h5>Requests to join as participant</h5>
				{!!listRequestsJoin.filter((item) => item.requested === 'participant').length && (
					<table className="air">
						<tr>
							<th>
								{listRequestsJoin.filter((item) => item.requested === 'participant').length} people
							</th>
							<th>Email</th>
							<th> </th>
							<th> </th>
						</tr>
						{listRequestsJoin
							.filter((item) => item.requested === 'participant')
							.map((item) => {
								return (
									<>
										{showRejectModal && (
											<RejectModal
												user={item.name}
												contest={contest.name}
												onRejectUser={() => this.onRejectUser(item.team_ref, item)}
												onHideModal={this.onHideModal}
											/>
										)}
										<tr>
											<td>
												<b>{item.name}</b>
											</td>
											<td>{item.user_email}</td>
											<td>
												<Button
													variant="outlined"
													size="small"
													onHandleClick={() => this.onRequest(item)}
												>
													Accept <FaCheck />
												</Button>
											</td>
											<td>
												<Button
													variant="outlined"
													size="small"
													onHandleClick={() => this.setState({showRejectModal: true})}
												>
													Reject <FaRegTimesCircle />
												</Button>
											</td>
										</tr>
									</>
								);
							})}
					</table>
				)}
				{!listRequestsJoin.filter((item) => item.requested === 'participant').length && (
					<>
						<hr />
						<p>No pending request.</p>
					</>
				)}

				{!!listRequestsJoin.filter((item) => item.requested === 'admin').length && (
					<>
						<hr className="extra-spacing" />

						<h5>Requests to join as {contest?.alias?.admin?.toLowerCase()}</h5>
						{listRequestsJoin &&
							listRequestsJoin
								.filter((item) => item.requested === 'admin')
								.map((item) => (
									<div className="TeamDetails__JoinList__Item">
										<div className="TeamDetails__JoinList_Accept">
											<Button
												variant="outlined"
												onHandleClick={() => this.onRequest(item.user_ref)}
											>
												Accept
											</Button>
										</div>
										<div className="TeamDetails__JoinList_Name">{item.name}</div>
									</div>
								))}
					</>
				)}
				<hr className="extra-spacing" />

				<ParticipantsList
					participants={contest.participants}
					teamNames={teamNames}
					updateParticipantMetadata={this.props.updateParticipantMetadata.bind(null, contestRef)}
				/>
			</div>
		);
	}
}

function ParticipantsList({participants = [], teamNames, updateParticipantMetadata}) {
	return (
		<div className="ContestArrival__Participants__Container">
			<h5>Mark arrival time for participants</h5>
			<table className="air">
				<thead>
					<tr>
						<th>{participants.length} people</th>
						<th>Email</th>
						<th>Team</th>
						<th>Confirmed</th>
						<th>Arrival confirmed</th>
					</tr>
				</thead>
				<tbody>
					{orderBy(participants, ['name']).map((participant) => {
						return (
							<ParticipantItem
								key={participant.ref}
								participant={participant}
								teamName={teamNames[participant.division] || ''}
								updateParticipantMetadata={updateParticipantMetadata}
							/>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

function ParticipantItem({participant, teamName, updateParticipantMetadata}) {
	const [showDistributionWarning, setDistributionWarning] = useState(false);
	const [showArrivalWarning, setArrivalWarning] = useState(false);

	const onConfirmArrival = async (person) => {
		await updateParticipantMetadata(person.ref, {
			...person.metadata,
			confirmed_arrival: new Date().toISOString(),
		});
	};

	const confirmedArrival = get(participant, 'metadata.confirmed_arrival');

	return (
		<>
			{showDistributionWarning && (
				<DialogBox
					title={'Please note'}
					errorBox={true}
					description={`To change the team please use the page 'Team Distribution'`}
					noCallback={() => setDistributionWarning(false)}
					yesCallback={() => setDistributionWarning(false)}
				/>
			)}

			{showArrivalWarning && (
				<DialogBox
					title={'Please note'}
					errorBox={true}
					description={`Arrival time has already been marked`}
					noCallback={() => setArrivalWarning(false)}
					yesCallback={() => setArrivalWarning(false)}
				/>
			)}
			<tr className="just-mouse">
				<td>{participant.name}</td>
				<td>{participant.email}</td>
				<td>
					<span onClick={() => setDistributionWarning(true)}>{teamName || '-'}</span>
				</td>
				<td>
					{confirmedArrival && (
						<span onClick={() => setArrivalWarning(true)}>
							<FaCheck />
						</span>
					)}
					{!confirmedArrival && (
						<span className="link" onClick={() => onConfirmArrival(participant)}>
							Confirm
						</span>
					)}
				</td>
				<td>{confirmedArrival ? dateFnsFormat(confirmedArrival, 'YYYY-MM-DD hh:mm') : '-'}</td>
			</tr>
		</>
	);
}

function mapStateToProps(state, props) {
	const getContestInfo = makeContestInfoSelector();
	const getJoinRequests = makeContestJoinRequestSelector();
	const contestRef = props.match.params.ref;

	return {
		contest: getContestInfo(state, {contestRef}),
		teamNames: teamNamesSelector(state, {contestRef}),
		isLoading: contestInfoIsLoadingSelector(state),
		listRequestsJoin: getJoinRequests(state, {contestRef}),
	};
}

export default connect(mapStateToProps, {
	fetchRequestForContest,
	onAcceptUser,
	updateParticipantMetadata,
	rejectContestRequest,
	fetchContest,
})(Arrival);
