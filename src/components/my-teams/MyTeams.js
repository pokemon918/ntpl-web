import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {format} from 'date-fns';

import {fetchMyTeams, addTeam, addTeamImage} from 'actions/teamActions';
import {routeConstants} from 'const';
import L18nText from 'components/shared/L18nText';
import Button from 'components/shared/ui/Button';
import Grid from 'components/shared/ui/Grid';
import ImageLoader from 'components/shared/ui/ImageLoader';
import PageHeader from 'components/shared/ui/PageHeader';
import Spinner from 'components/shared/ui/Spinner';

import {CreateTeamModal} from './partials';
import './MyTeams.scss';

class MyTeams extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			isLoading: false,
			pictureCreatedTeam: '',
		};
		this.toggle = this.toggle.bind(this);
		this.saveTeam = this.saveTeam.bind(this);
	}

	componentDidMount() {
		this.initTeams();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.createdTeamRef !== prevProps.createdTeamRef) {
			if (!this.props.teams.error && this.state.pictureCreatedTeam && this.props.createdTeamRef) {
				let formData = new FormData();
				formData.append('avatar', this.state.pictureCreatedTeam);

				this.props.addTeamImage(this.props.createdTeamRef, formData);

				this.setState({
					pictureCreatedTeam: '',
				});
			}
		}
	}

	async initTeams() {
		try {
			await this.props.fetchMyTeams(this.props.history);

			if (this.props.teams.error) {
				this.setState({
					isLoading: true,
				});
			}
		} catch (err) {
			this.setState({isLoading: false});
		}
	}

	toggle() {
		this.setState({
			modal: !this.state.modal,
		});
	}

	async saveTeam(teamData, saveCallback = null) {
		this.setState({isLoading: true});
		const avatar = teamData.avatar;

		delete teamData.avatar;

		let addTeamCallback = () => {
			if (saveCallback) {
				saveCallback();
			}
			this.toggle();
		};
		this.setState({pictureCreatedTeam: avatar});
		try {
			await this.props.addTeam(teamData, addTeamCallback, this.props.history);
			this.setState({isLoading: false});
		} catch (err) {
			this.setState({isLoading: false});
		}
	}

	groupItem = (team, index) => (
		<Link key={index} to={`${routeConstants.TEAM}/${team.ref}`}>
			<div className="MyTeam__Item">
				<div className="MyTeam__Item_Title_Wrapper">
					<div className="MyTeam__Item_Image">
						<ImageLoader
							src={
								team.avatar && `${this.props.app?.advancedOptions.serverUrl}/images/${team.avatar}`
							}
							alt={`Picture for team ${team.name}`}
						/>
					</div>
					<div className="MyTeam__Item_Title">
						<span>{team.name}</span>
					</div>
				</div>
				<div className="MyTeam__Item_Participants">
					{team.membersCount}{' '}
					<L18nText
						id={team.membersCount === 1 ? 'team_member' : 'team_members'}
						defaultMessage="members"
					/>
				</div>
				<div className="MyTeam__Item_CreateOn">{format(team.created_at, 'DD MMM YYYY')}</div>
			</div>
		</Link>
	);

	get teams() {
		const {
			teams: {myTeams = [], error},
		} = this.props;
		const {isLoading} = this.state;
		let content = null;

		let groupYouAreManage = [];
		let groupYouAreMemberOf = [];

		if (myTeams.length <= 0 && error === null) {
			content = (
				<div>
					<L18nText id="team_no_items" defaultMessage="You currently have no teams." />
				</div>
			);
		}

		if (myTeams.length > 0) {
			myTeams.forEach((team) => {
				if (team.userRelations.includes('member')) {
					groupYouAreMemberOf.push(team);
				} else {
					groupYouAreManage.push(team);
				}
			});
		}

		if (error) {
			content = (
				<div className="MyTeams__Error">
					{error && !isLoading && (
						<>
							<div className="MyTeams__Error_Title">
								<L18nText id="team_fetch_rejected" defaultMessage="Failed to load your teams!" />
							</div>

							<Button onHandleClick={this.initTeams.bind(this)}>
								<L18nText id="try_again" defaultMessage="Try Again" />
							</Button>
						</>
					)}
				</div>
			);
		}

		if (myTeams && myTeams.length > 0) {
			content = (
				<div>
					<div className="MyTeam_Manage">
						<div className="MyTeam__Items_Title">
							<L18nText id={'team_you_are_managing'} defaultMessage="Teams you are managing" />
						</div>

						{groupYouAreManage.length > 0 && (
							<div className="MyTeam__Items">
								{groupYouAreManage.map((team, i) => {
									return this.groupItem(team, i);
								})}
							</div>
						)}
					</div>

					{groupYouAreMemberOf.length > 0 && (
						<div className="MyTeam_Member">
							<div className="MyTeam__Items_Title">
								<L18nText
									id={'team_you_are_member_of'}
									defaultMessage="Teams you are a member of"
								/>
							</div>
							<div className="MyTeam__Items">
								{groupYouAreMemberOf.map((team, i) => {
									return this.groupItem(team, i);
								})}
							</div>
						</div>
					)}
				</div>
			);
		}

		return content;
	}

	render() {
		const {isLoading} = this.state;

		return (
			<>
				<Grid columns={8}>
					<div className="MyTeams_Container">
						<PageHeader title="team_title" />

						<div className="MyTeams__Content">
							<div className="MyTeams__Actions">
								<Button onHandleClick={this.toggle} variant="outlined" size="small">
									<L18nText id="team_create_button" defaultMessage="Create new team" />
								</Button>
							</div>
							{this.props.teams.error && this.state.isLoading && (
								<div className="Spinner_Wrap">
									<Spinner />
								</div>
							)}
							{this.teams}

							<CreateTeamModal
								isOpen={this.state.modal}
								saveCallback={this.saveTeam}
								handleChange={this.handleChange}
								toggle={this.toggle}
								isSaving={isLoading}
							/>
						</div>
					</div>
				</Grid>
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user,
		teams: state.teams,
		createdTeamRef: state.teams.createdTeamRef,
	};
}

export {MyTeams as UnconnectedMyTeams};

export default connect(mapStateToProps, {fetchMyTeams, addTeam, addTeamImage})(MyTeams);
