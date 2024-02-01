import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {routeConstants} from 'const';
import L18nText from 'components/shared/L18nText';

const BottomNavLinks = (props) => (
	<div className="BottomNavLinks__Container" data-testid="bottom-nav-links">
		<div className="BottomNavLinks">
			<Link
				to={routeConstants.TASTING}
				onClick={(e) => {
					props.closeSideNav();
				}}
				data-test="nav_newTasting"
			>
				<L18nText id="nav_newTasting" defaultMessage="New Tasting" />
			</Link>
			<Link
				to={routeConstants.MY_TASTINGS}
				onClick={(e) => {
					props.closeSideNav();
				}}
				data-test="nav_myTasting"
			>
				<L18nText id="nav_myTasting" defaultMessage="My Tastings" />
			</Link>
		</div>
	</div>
);

BottomNavLinks.propTypes = {
	closeSideNav: PropTypes.func.isRequired,
};

export default BottomNavLinks;
