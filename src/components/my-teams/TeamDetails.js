import React, {Component} from 'react';
import {format} from 'date-fns';
import {connect} from 'react-redux';
import {
	fetchSelectedTeam,
	updateSelectedTeam,
	clearSelectedTeam,
	addTeamImage,
	joinToTeam,
	getListRequestsJoining,
	acceptRequestToJoin,
	declineRequestToJoin,
	inviteMembers,
} from 'actions/teamActions';
import {addEvent, addEventImage} from 'actions/eventActions';

import './TeamDetails.scss';
import L18nText from 'components/shared/L18nText';
import Grid from '../shared/ui/Grid';

import DefaultImage from 'assets/images/no-image.jpg';
import Button from '../shared/ui/Button';
import UpdateTeamModal from './partials/UpdateTeamModal';
import {CreateEventModal} from '../events/partials';
import InviteMembersModal from './partials/InviteMembersModal';

const events = [
	{
		name: "July tasting at Shawn's",
		created_at: '2019-07-26 08:45:09',
		participants: 26,
	},
	{
		name: "May tasting at Shawn's (Previously)",
		created_at: '2019-05-24 08:45:09',
		participants: 12,
	},
];

const participants = [
	{
		name: 'Leslee Moss',
		location: 'Louisville',
	},
	{
		name: 'Eva Lee',
		location: 'Saint Petersburg',
	},
	{
		name: 'Asaka Chimako',
		location: 'Milan',
	},
	{
		name: 'Sara Scholz',
		location: 'Brisbane',
	},
	{
		name: 'Caspar Sawrey',
		location: 'Karachi',
	},
	{
		name: 'Grigorly Kozhykhov',
		location: 'Vancouver',
	},
	{
		name: 'Leslee Moss',
		location: 'Louisville',
	},
	{
		name: 'Leslee Moss',
		location: 'Louisville',
	},
	{
		name: 'Leslee Moss',
		location: 'Louisville',
	},
	{
		name: 'Leslee Moss',
		location: 'Louisville',
	},
	{
		name: 'Leslee Moss',
		location: 'Louisville',
	},
];

class TeamDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pictureCreatedEvent: '',
			nameCreatedEvent: '',
			teamRef: '',
			isLoading: false,
			membersInputList: [],
			showUpdateTeamModal: false,
			showCreateEventModal: false,
			showInviteMembersModal: false,
		};
		this.createEvent = this.createEvent.bind(this);
		this.updateTeam = this.updateTeam.bind(this);
		this.fetchJoinRequests = this.fetchJoinRequests.bind(this);
		this.inviteMembers = this.inviteMembers.bind(this);
	}

	async componentDidMount() {
		const {
			teams,
			match: {params},
		} = this.props;
		this.setState({isLoading: true});
		await this.props.fetchSelectedTeam(params.teamRef, teams, this.props.history);

		await this.fetchJoinRequests(params.teamRef);
		this.setState({isLoading: false});

		this.setState({
			teamRef: params.teamRef,
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.createdEventRef !== prevProps.createdEventRef) {
			if (
				!this.props.events.error &&
				this.state.pictureCreatedEvent &&
				this.props.createdEventRef
			) {
				let formData = new FormData();
				formData.append('avatar', this.state.pictureCreatedEvent);
				formData.append('name', this.state.nameCreatedEvent);

				this.props.addEventImage(this.props.createdEventRef, formData);

				this.setState({
					pictureCreatedEvent: '',
					nameCreatedEvent: '',
				});
			}
		}
	}

	async fetchJoinRequests(teamRef) {
		const {userRelations} = this.props.selectedTeam.data;
		const isOwnerOrAdmin = userRelations.includes('owner') || userRelations.includes('admin'); // TODO: fix

		if (isOwnerOrAdmin) {
			await this.props.getListRequestsJoining(teamRef, this.props.history);
		}
	}

	joinToTeam = async () => {
		const {teamRef} = this.state;
		await this.props.joinToTeam(teamRef, this.props.history);
	};

	acceptRequestToJoin = async (actionRef) => {
		const {teamRef} = this.state;
		await this.props.acceptRequestToJoin(teamRef, actionRef);
	};

	declineRequestToJoin = async (actionRef) => {
		const {teamRef} = this.state;
		await this.props.declineRequestToJoin(teamRef, actionRef);
	};

	async updateTeam(teamData) {
		this.setState({isLoading: true});
		const selectedTeam = this.props.selectedTeam.data;
		const userRelations = selectedTeam ? selectedTeam.userRelations : [];

		const isOwnerOrAdmin = userRelations.includes('owner') || userRelations.includes('admin');
		const isEditor = userRelations.includes('editor');

		const changedData = {};

		if (selectedTeam.name !== teamData.name && (isOwnerOrAdmin || isEditor)) {
			changedData.name = teamData.name;
		}

		if (selectedTeam.description !== teamData.description && (isOwnerOrAdmin || isEditor)) {
			changedData.description = teamData.description;
		}

		if (
			selectedTeam.city !== teamData.city &&
			selectedTeam.country !== teamData.country &&
			(isOwnerOrAdmin || isEditor)
		) {
			changedData.city = teamData.city;
			changedData.country = teamData.country;
		}

		if (teamData.avatar && (isOwnerOrAdmin || isEditor)) {
			let formData = new FormData();
			formData.append('avatar', teamData.avatar);
			formData.append('name', teamData.name);

			this.props.addTeamImage(selectedTeam.ref, formData);
		}
		if (Object.keys(changedData).length) {
			await this.props.updateSelectedTeam(selectedTeam.ref, changedData);
		}
		this.setState({isLoading: false});
		this.setState({showUpdateTeamModal: false});
	}

	openEditTeamModal = () => {
		this.setState({
			showUpdateTeamModal: true,
		});
	};

	async createEvent(eventData, saveCallback = null) {
		this.setState({isLoading: true});

		const avatar = eventData.avatar;

		delete eventData.avatar;

		let addEventCallback = () => {
			if (saveCallback) {
				saveCallback();
			}
		};
		this.setState({
			pictureCreatedEvent: avatar,
			nameCreatedEvent: eventData.name,
			showCreateEventModal: false,
		});

		await this.props.addEvent(eventData, addEventCallback);
		this.setState({isLoading: false});
	}

	async inviteMembers() {
		let payload = {
			invitees: this.state.membersInputList,
		};

		await this.props.inviteMembers(this.state.teamRef, payload, this.props.history);

		this.setState({
			showInviteMembersModal: !!this.props.teamErrors,
		});
	}

	openCreateEventModal = () => {
		this.setState({
			showCreateEventModal: true,
		});
	};

	openInviteMembersModal = () => {
		this.setState({
			showInviteMembersModal: true,
		});
	};

	inviteMembersTextChanged = (text) => {
		let inputList = text.split('\n');

		if (inputList.length) {
			this.setState({
				membersInputList: inputList,
			});
		}
	};

	componentWillUnmount() {
		this.props.clearSelectedTeam();
	}

	get team() {
		const selectedTeam = this.props.selectedTeam.data;
		const {listRequestsJoin = []} = this.props.selectedTeam;
		const {wines} = this.props;
		const eventWines = wines.data.map((wine) => {
			return {
				value: wine.ref,
				label: wine.name,
			};
		});

		if (selectedTeam === null) {
			return (
				<h2>
					<L18nText id="team_error_load_data" defaultMessage="Unable to load data." />
				</h2>
			);
		}

		const userRelations = selectedTeam.userRelations || [];
		const notMemberYet = userRelations.length === 0;
		const isOwnerOrAdmin = userRelations.includes('owner') || userRelations.includes('admin');

		const hasRef = selectedTeam && selectedTeam.ref;
		const teamImageUrl = selectedTeam.avatar
			? `${this.props.app.advancedOptions.serverUrl}/images/${selectedTeam.avatar}`
			: DefaultImage;

		return (
			<Grid columns={6}>
				<div className="TeamDetails__Wrapper">
					<div className="my-teams-btn-wrapper">
						{!hasRef && (
							<span>
								{' '}
								(
								<L18nText
									id="team_offline_error"
									defaultMessage="Please go online to make changes"
								/>
								).
							</span>
						)}
					</div>
					<CreateEventModal
						isOpen={this.state.showCreateEventModal}
						saveCallback={this.createEvent}
						toggle={() => this.setState({showCreateEventModal: false})}
						eventWines={eventWines}
					/>

					<UpdateTeamModal
						isOpen={this.state.showUpdateTeamModal}
						toggle={() => this.setState({showUpdateTeamModal: false})}
						saveCallback={this.updateTeam}
						data={selectedTeam}
						isSaving={this.state.isLoading}
						serverUrl={this.props.app.advancedOptions.serverUrl}
					/>
					{this.state.showInviteMembersModal && (
						<InviteMembersModal
							saveCallback={this.inviteMembers}
							toggle={() => this.setState({showInviteMembersModal: false})}
							teamName={selectedTeam.name}
							description={'team_invite_members_description'}
							onInputChange={this.inviteMembersTextChanged}
						/>
					)}

					<div className="TeamDetails__Header_Wrapper">
						<div className="TeamDetails__Header">
							<div className="TeamDetails__Image">
								<img src={teamImageUrl} alt="Team" />
							</div>
							<div className="TeamDetails__Title_Wrapper">
								<div className="TeamDetails__Header_Title">
									<h2>{selectedTeam.name}</h2>
								</div>
								<div className="TeamDetails__Caption">
									{selectedTeam.city && selectedTeam.country && (
										<span className="TeamDetails__Location">
											{selectedTeam.city}, {selectedTeam.country}
										</span>
									)}
									{selectedTeam.created_at && (
										<span className="TeamDetails__Created">
											<L18nText id="team_created_on" defaultMessage="Created on" />
											{format(selectedTeam.created_at, 'DD MMM YYYY')}
										</span>
									)}
								</div>
							</div>
						</div>
						<div className="TeamDetails__Header_Buttons">
							{isOwnerOrAdmin && (
								<Button variant="outlined" size="small" onHandleClick={this.openEditTeamModal}>
									<L18nText id={'team_edit'} defaulMessage="Edit" />
								</Button>
							)}
							{notMemberYet && (
								<Button size="small" onHandleClick={this.joinToTeam}>
									<L18nText id={'team_join'} defaultMessage="Join team" />
								</Button>
							)}
						</div>
					</div>
					<div className="TeamDetails__Description_Wrapper">
						<div className="TeamDetails__Title">
							<L18nText id={'team_description'} defaultMessage="Description" />
						</div>
						<div className="TeamDetails__Description">
							<p> {selectedTeam && selectedTeam.description}</p>
						</div>
					</div>
					<div className="TeamDetails__Events_Wrapper">
						<div className="TeamDetails__Title">
							<L18nText id={'team_events'} defaultMessage="Events" />
							{isOwnerOrAdmin && (
								<Button variant="outlined" size="small" onHandleClick={this.openCreateEventModal}>
									<L18nText id={'team_event_create'} defaulMessage="Create event" />
								</Button>
							)}
						</div>
						<div className="TeamDetails__Events">
							{events.map((event) => (
								<div className="TeamDetails__Event_Item">
									<div className="TeamDetails__Event_Name">
										<span>{event.name}</span>
									</div>
									<div className="TeamDetails__Event_Info">
										<span>{format(event.created_at, 'DD MMMM YYYY')}</span>
									</div>
									<div className="TeamDetails__Event_Info">
										<span>{event.participants} participants</span>
									</div>
									{isOwnerOrAdmin && (
										<div className="TeamDetails__Event_Edit">
											<L18nText id={'team_edit'} defaultMessage="Edit" />
										</div>
									)}
								</div>
							))}
						</div>
					</div>
					{isOwnerOrAdmin && (
						<div className="TeamDetails__Members_Wrapper">
							<div className="TeamDetails__Title">
								<div className="TeamDetails__Title_Members">
									<L18nText id={'team_members'} defaultMessage="Members" />{' '}
									<p>({participants.length})</p>
								</div>
								<Button variant="outlined" size="small" onHandleClick={this.openInviteMembersModal}>
									<L18nText id={'team_invite'} defaulMessage="Invite" />
								</Button>
							</div>
							<div className="TeamDetails__Members">
								{participants.map((participant) => (
									<div className="TeamDetails__Member_Item">
										<div className="TeamDetails__Member_Image">
											<img
												src={participant.image ? participant.image : DefaultImage}
												alt="Member"
											/>
										</div>
										<div className="TeamDetails__Member_Name">
											<span>{participant.name}</span>
										</div>
										<div className="TeamDetails__Member_Location">
											<span>{participant.location}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					{isOwnerOrAdmin && (
						<div className="TeamDetails__JoinList">
							<div className="TeamDetails__Title">
								<L18nText id={'team_join_requests'} defaultMessage="Join requests" />
							</div>
							{listRequestsJoin.map((item) => (
								<div className="TeamDetails__JoinList__Item">
									<div className="TeamDetails__JoinList_Name">{item.ref}</div>
									<div className="TeamDetails__JoinList_Accept">
										<div onClick={() => this.acceptRequestToJoin(item.ref)}>
											<L18nText id={'team_accept'} defaultMessage="Accept" />
										</div>
									</div>
									<div className="TeamDetails__JoinList_Decline">
										<div onClick={() => this.declineRequestToJoin(item.ref)}>
											<L18nText id={'team_decline'} defaultMessage="Decline" />
										</div>
									</div>
									<div className="TeamDetails__JoinList_Date">
										{format(item.created_at, 'DD MMM YYYY')}
									</div>
								</div>
							))}
							{!listRequestsJoin.length && (
								<div className="TeamDetails__JoinList_Empty">
									<L18nText
										id="team_no_requests_to_join"
										defaultMessage="No requests to display."
									/>
								</div>
							)}
						</div>
					)}
				</div>
			</Grid>
		);
	}

	render() {
		const team = this.team;
		return <div>{team}</div>;
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		teams: state.teams.data,
		teamErrors: state.teams.error,
		wines: state.wines,
		events: state.events,
		createdEventRef: state.events.createdEventRef,
		selectedTeam: state.selectedTeam,
	};
}

export default connect(mapStateToProps, {
	fetchSelectedTeam,
	clearSelectedTeam,
	updateSelectedTeam,
	addEvent,
	addEventImage,
	addTeamImage,
	joinToTeam,
	getListRequestsJoining,
	acceptRequestToJoin,
	declineRequestToJoin,
	inviteMembers,
})(TeamDetails);
