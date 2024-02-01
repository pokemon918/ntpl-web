import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {routeConstants} from 'const';
import L18nText from 'components/shared/L18nText';

class Home extends Component {
	render() {
		return (
			<div className="home-page">
				<h1>
					<L18nText id="sidenav_home" defaultMessage="Home" />
				</h1>
				<ul>
					<li>
						<Link to={routeConstants.MY_TASTINGS}>
							<L18nText id="sidenav_my_wines" defaultMessage="My Wines" />
						</Link>
					</li>
					<li>
						<Link to={routeConstants.TASTING}>
							<L18nText id="sidenav_tasting" defaultMessage="Tasting" />
						</Link>
					</li>
					<li>
						<Link to={routeConstants.PROFILE}>
							<L18nText id="sidenav_settings" defaultMessage="Settings" />
						</Link>
					</li>
				</ul>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

export default connect(mapStateToProps)(Home);
