import React, {Component} from 'react';
import dateFnsFormat from 'date-fns/format';

import {roles} from './roles';
import DropoverLink from 'components/shared/ui/DropoverLink';
import {sortByName} from '../common';
import DialogBox from 'components/shared/ui/DialogBox';

class TeamContest extends Component {
	state = {
		showAssignTeam: false,
		showAssignRole: false,
		showArrivalWarning: false,
	};

	onHideAssignTeam = () => {
		this.setState({showAssignTeam: false});
	};

	onShowAssignTeam = (subject) => {
		this.setState({showAssignTeam: true});
	};

	onHideAssignRole = () => {
		this.setState({showAssignRole: false});
	};

	onShowAssignRole = (subject) => {
		this.setState({showAssignRole: true});
	};

	updateTeam = (item, selectedteamRef, currentTeamRef) => {
		if (selectedteamRef !== currentTeamRef) this.props.onUpdateTeam(item, selectedteamRef);
		this.setState({showAssignTeam: false});
	};

	updateRole = (item, role) => {
		this.props.onUpdateRole(item, role);
		this.setState({showAssignRole: false});
	};

	render() {
		const {showArrivalWarning} = this.state;
		const {team, participants, columns, teams, alias} = this.props;

		const roleList = roles.map((role) => {
			return {...role, name: alias[role.id], id: role.id};
		});
		const teamId = teams.map((team) => {
			return {...team, id: team.name};
		});
		const teamList = [...teamId, {id: 'none', name: 'Remove from team', ref: 'remove'}];

		return (
			<>
				{showArrivalWarning && (
					<DialogBox
						title={'Please note'}
						errorBox={true}
						description={`To mark the arrival time, please go to the page "Accept and Arrival"`}
						noCallback={() => this.setState({showArrivalWarning: false})}
						yesCallback={() => this.setState({showArrivalWarning: false})}
					/>
				)}
				<thead>
					<tr class="ContestProgress__Header">
						<th>
							{`${
								participants.filter((item) => item.division === team.ref).length
							} participants`.replace(/1 participants/, '1 partisipant')}
						</th>
						{columns.map((column) => (
							<th>{column}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{participants
						.filter((item) => item.division === team.ref)
						.sort(sortByName)
						.map((item) => {
							const metadata = item.metadata;
							const confirmedArrival =
								metadata && !!Object.keys(metadata).length && metadata.confirmed_arrival;

							return (
								<tr className="ContestProgress__Row center" key={item.ref}>
									<td>{item.name ? item.name : '-'}</td>
									<td>{item.email ? item.email : '-'}</td>
									<td>
										<DropoverLink
											label="Assign to team"
											hideTextLabel
											options={teamList}
											onSelect={(selectedTeam) => this.updateTeam(item, selectedTeam.ref, team.ref)}
											value={team.name}
										/>
									</td>
									<td>
										<DropoverLink
											label="Select role"
											hideTextLabel
											options={roleList}
											onSelect={(role) => this.updateRole(item, role)}
											value={(item.role && alias[item.role]) || 'Select role'}
										/>
									</td>
									<td>
										{confirmedArrival ? (
											dateFnsFormat(confirmedArrival, 'YYYY-MM-DD hh:mm')
										) : (
											<span
												onClick={() => this.setState({showArrivalWarning: true})}
												className="no-select"
											>
												-
											</span>
										)}
									</td>
								</tr>
							);
						})}
				</tbody>
			</>
		);
	}
}

export default TeamContest;
