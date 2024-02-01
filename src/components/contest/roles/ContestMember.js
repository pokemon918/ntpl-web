import React, {Component} from 'react';

import NotFound from '../common/NotFound';

class ContestMember extends Component {
	render() {
		const {contest} = this.props;
		if (!contest) {
			return <NotFound />;
		}

		const {
			contest: {teams = []},
		} = this.props;

		const team = teams[0] || {};

		return (
			<div>
				<h3>Welcome to {team.name}</h3>
				<p>
					You have been assigned to {team.name}. Please go back, or select "events" in the menu to
					select a flight.
				</p>

				{/*			<p>As part of {name} you can access the following:</p>
				<ul className="links">
					{collections
						.filter((el) => {
							if (el.start_date && new Date() < new Date(el.start_date)) {
								return false;
							}

							if (el.end_date && new Date(el.end_date) < new Date()) {
								return false;
							}

							return true;
						})
						.sort(sortByName)
						.map((collection) => (
							<li>
								<Link
									to={getLinkWithArguments(routeConstants.EVENT_REF, {
										eventRef: collection.ref,
									})}
								>
									{collection.name}
								</Link>
							</li>
						))}
					{!collections.length && <li>No access given at the moment</li>}
				</ul>*/}
			</div>
		);
	}
}

export default ContestMember;
