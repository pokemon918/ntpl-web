import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import NotFound from '../common/NotFound';
import {getLinkWithArguments} from 'commons/commons';
import {routeConstants} from 'const';

class ContestAdmin extends Component {
	render() {
		const {contest} = this.props;

		if (!contest) {
			return <NotFound />;
		}

		const {
			contest: {ref, name},
		} = this.props;

		return (
			<div className="contest-admin">
				<p>
					As {contest?.alias?.admin || 'Admin'} for {name} you have access to the following:
				</p>

				<ul className="links">
					<li>
						Aprove requests to join and set arrival time for people in{' '}
						<Link
							to={getLinkWithArguments(routeConstants.CONTEST_ARRIVAL, {
								ref,
							})}
						>
							Approve and Arrival
						</Link>
					</li>
					<li>
						Allocate people to teams and give them roles in{' '}
						<Link
							to={getLinkWithArguments(routeConstants.CONTEST_DISTRIBUTION, {
								ref,
							})}
						>
							Team Distribution
						</Link>
					</li>
					<li>
						Provide the final assessment for each wine in{' '}
						<Link
							to={getLinkWithArguments(routeConstants.CONTEST_ASSESSMENT, {
								ref,
							})}
						>
							{contest?.alias?.admin || 'Admin'} Dashboard
						</Link>
					</li>
					<li>
						Follow the overall progress in{' '}
						<Link
							to={getLinkWithArguments(routeConstants.CONTEST_PROGRESS, {
								ref,
							})}
						>
							Contest Progress
						</Link>
					</li>
					<li>
						See the results per {contest?.alias?.theme?.toLowerCase() || 'theme'} in{' '}
						<Link
							to={getLinkWithArguments(routeConstants.CONTEST_RESULT, {
								ref,
							})}
						>
							Medal Overview
						</Link>{' '}
						and{' '}
						<Link
							to={getLinkWithArguments(routeConstants.CONTEST_TROPHY, {
								ref,
							})}
						>
							Trophy Overview
						</Link>
					</li>
				</ul>
			</div>
		);
	}
}

export default ContestAdmin;
