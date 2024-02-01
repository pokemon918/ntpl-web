import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {getLinkWithArguments} from 'commons/commons';
import {routeConstants} from 'const';
import NotFound from '../common/NotFound';
import {sortByName} from '../common';

import Button from 'components/shared/ui/Button';

class ContestTeamLeader extends Component {
	render() {
		const {contest} = this.props;

		if (!contest) {
			return <NotFound />;
		}

		const {
			contest: {collections, ref, teams = []},
		} = this.props;

		const team = teams[0] || {};

		return (
			<>
				<span style={{float: 'right'}}>
					<Button
						//className="corner-button"
						variant={'outlined'}
						size="small"
					>
						<Link
							to={getLinkWithArguments(routeConstants.CONTEST_RESULT, {
								ref: this.props.contest.ref,
							})}
						>
							List final scores
						</Link>
					</Button>
				</span>
				<h3>{team.name}</h3>
				<p>
					As {contest.alias.leader.toLowerCase()} for {team.name} you can access each{' '}
					{contest.alias.collection.toLowerCase()} on behalf of your team here:
				</p>

				<ul className="links">
					{collections &&
						collections
							.filter((el) => {
								if (el.start_date) {
									if (new Date() < new Date(el.start_date)) return false;
								}
								if (el.end_date) {
									if (new Date(el.end_date) < new Date()) return false;
								}
								return true;
							})
							.sort(sortByName)
							.map((collection) => (
								<li className="">
									<Link
										to={getLinkWithArguments(routeConstants.CONTEST_TEAM_DASHBOARD, {
											ref,
											collection: collection.ref,
											teamRef: team.ref,
										})}
									>
										{collection.name}
									</Link>
								</li>
							))}

					<hr className="extra-spacing" />
				</ul>
			</>
		);
	}
}

export default ContestTeamLeader;
