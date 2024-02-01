import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {routeConstants} from 'const';
import L18nText from 'components/shared/L18nText';
import {ReactComponent as ChevronIcon} from './Icon_ChevronRight.svg';

const subMenuItems = {
	tasting: {
		name: 'nav_tasting',
		defaultMessage: 'nav_tasting',
		items: [
			{
				name: 'nav_myTasting',
				defaultMessage: 'My Tastings',
				link: routeConstants.MY_TASTINGS,
			},
			{
				name: 'nav_newTasting',
				defaultMessage: 'New Tasting',
				link: routeConstants.TASTING,
			},
		],
	},
	event: {
		name: 'nav_event',
		defaultMessage: 'nav_event',
		items: [
			{
				name: 'nav_events',
				defaultMessage: 'Events',
				link: routeConstants.EVENTS,
			},
		],
	},
	allEvent: {
		name: 'nav_event',
		defaultMessage: 'nav_event',
		items: [
			{
				name: 'nav_myEvents',
				defaultMessage: 'My Events',
				link: routeConstants.MY_EVENTS,
			},
			{
				name: 'nav_events',
				defaultMessage: 'Events',
				link: routeConstants.EVENTS,
			},
		],
	},
	team: {
		name: 'nav_team',
		defaultMessage: 'nav_team',
		items: [
			{
				name: 'nav_myTeams',
				defaultMessage: 'My Teams',
				link: routeConstants.MY_TEAMS,
			},
		],
	},
	about: {
		name: 'nav_about',
		defaultMessage: 'nav_about',
		items: [
			{
				name: 'nav_about',
				defaultMessage: 'nav_about',
				link: routeConstants.HOME,
			},
		],
	},
};

const SubNavLinks = ({id, closeSideNav = () => null, onCloseSubMenu, navBar = {}}) => {
	return (
		<div className="SubNavLinks sub-links">
			<div
				onClick={(e) => {
					onCloseSubMenu();
				}}
			>
				{subMenuItems[id] ? (
					<L18nText id={subMenuItems[id].name} defaultMessage={subMenuItems[id].defaultMessage} />
				) : (
					<span>{id}</span>
				)}
				<span className="SiteMenu__Chevron inverse">
					<ChevronIcon />
				</span>
			</div>
			{subMenuItems[id]
				? subMenuItems[id].items.map((item, index) => (
						<Link
							key={index}
							to={item.link}
							onClick={(e) => {
								closeSideNav();
							}}
						>
							<L18nText id={item.name} defaultMessage={item.defaultMessage} />
						</Link>
				  ))
				: navBar.children.map((item, index) => (
						<a
							key={index}
							href={item.url}
							target="_top"
							rel="noopener noreferrer"
							onClick={(e) => {
								closeSideNav();
							}}
						>
							{item.title}
						</a>
				  ))}
		</div>
	);
};

SubNavLinks.propTypes = {
	id: PropTypes.string,
	onCloseSubMenu: PropTypes.func,
	closeSideNav: PropTypes.func.isRequired,
};

export default SubNavLinks;
