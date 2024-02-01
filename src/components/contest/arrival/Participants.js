import React, {Component} from 'react';
import dateFnsFormat from 'date-fns/format';

import DropoverLink from 'components/shared/ui/DropoverLink';
import {sortByName} from '../common';

class Participant extends Component {
	updateTeam = (item, teamRef) => {
		this.props.onUpdateTeam(item, teamRef);
	};

	render() {
		const {participants, teams} = this.props;

		return (
			<div className="ContestArrival__Wrapper">
				<table>
					<tr className="ContestProgress__Header">
						{this.props.columns.map((column) => (
							<th>{column}</th>
						))}
					</tr>
					{participants
						.filter((item) => !item.division && item.metadata?.confirmed_arrival)
						.sort(sortByName)
						.map((item) => {
							const metadata = item.metadata;
							const confirmedArrival =
								metadata && !!Object.keys(metadata).length && metadata.confirmed_arrival;

							return (
								<tr className="ContestProgress__Row center" key={item.ref}>
									<td>{item.name ? item.name : '-'}</td>
									<td>{item.email ? item.email : '-'}</td>
									<td className="ContestProgress__Dropdown">
										<DropoverLink
											label="Assign to team"
											hideTextLabel
											options={teams}
											onSelect={(team) => this.updateTeam(item, team.ref)}
											value={'Assign to team'}
										/>
									</td>
									<td>
										{confirmedArrival ? dateFnsFormat(confirmedArrival, 'YYYY-MM-DD hh:mm') : '-'}
									</td>
								</tr>
							);
						})}
				</table>
			</div>
		);
	}
}

export default Participant;
