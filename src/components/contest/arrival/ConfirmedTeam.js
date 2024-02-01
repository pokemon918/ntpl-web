import React, {Component} from 'react';
import {FaCheck} from 'react-icons/fa';
import {sortByName} from '../common';

class Participant extends Component {
	onSelectTeam = (value, id) => {
		const {participants} = this.props;
		const selectedparticipant = participants.find((participant) => participant.ref === id);

		selectedparticipant['team_ref'] = value.ref;
		this.props.onAddTeam(
			participants.map((el) => (el.ref === id ? {...el, selectedparticipant} : el))
		);
	};

	render() {
		const {teams, participants} = this.props;

		return (
			<div className="ContestTable__Wrapper">
				<table>
					<tr class="ContestArrival__Wrapper">
						{this.props.columns.map((column) => (
							<th>{column}</th>
						))}
					</tr>
					{participants
						.filter((item) => item.team_ref)
						.filter((item) => item.role)
						.sort(sortByName)
						.map((item) => {
							const teamName = teams.find((team) => team.ref === item.team_ref);

							return (
								<tr className="ContestProgress__Row center" key={item.id}>
									<td>{item.name ? item.name : '-'}</td>
									<td>{teamName.name}</td>
									<td>{item.role}</td>
									<td>
										<FaCheck />
									</td>
									<td>2019-08-04 11:55:31</td>
								</tr>
							);
						})}
				</table>
			</div>
		);
	}
}

export default Participant;
