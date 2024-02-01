import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {routeConstants} from 'const';
import L18nText from 'components/shared/L18nText';

const subMenuItems = [
	{
		to: routeConstants.PROFILE,
		name: 'nav_profile',
		defaultMessage: 'Profile',
	},
	{
		to: routeConstants.LOGOUT,
		name: 'nav_logout',
		defaultMessage: 'Log Out',
	},
];

const otherMenuItems = [
	{
		to: `${routeConstants.SIGN_UP}${window.location.search}`,
		name: 'nav_signup',
		img: 'https://noteable.co/wp-content/uploads/2019/06/signup-24x24.png',
		defaultMessage: 'Sign up',
	},
	{
		to: `${routeConstants.SIGN_IN}${window.location.search}`,
		img: 'https://noteable.co/wp-content/uploads/2019/06/login.png',
		name: 'nav_log_in',
		defaultMessage: 'Log in',
	},
];

const OtherNavLinks = (props) => {
	const activeNavLinks = props.isAuthenticated ? subMenuItems : otherMenuItems;

	return (
		<div className="OtherNavLinks" data-testid="other-nav-links">
			{activeNavLinks.map((nav) => (
				<>
					<Link
						to={nav.to}
						onClick={(e) => {
							props.closeSideNav();
						}}
					>
						{nav.img && <img width="16px" height="16px" src={nav.img} alt="close" />}
						<L18nText id={nav.name} defaultMessage={nav.defaultMessage} />
					</Link>
				</>
			))}
		</div>
	);
};

OtherNavLinks.propTypes = {
	closeSideNav: PropTypes.func.isRequired,
};

export default OtherNavLinks;
