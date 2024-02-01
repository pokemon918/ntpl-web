import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {routeConstants} from 'const';

import L18nText from 'components/shared/L18nText';

import {ReactComponent as ChevronIconUp} from './Icon_ChevronUp.svg';
import {ReactComponent as ChevronIconDown} from './Icon_ChevronDown.svg';
import {isProductionSite} from 'commons/commons';

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
	// team: {
	// 	name: 'nav_team',
	// 	defaultMessage: 'nav_team',
	// 	items: [
	// 		{
	// 			name: 'nav_myTeams',
	// 			defaultMessage: 'My Teams',
	// 			link: routeConstants.MY_TEAMS,
	// 		},
	// 	],
	// },
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

const SignedInNavLinks = ({navBar, setTastingId, fullVersionMode, id, closeSideNav}) => {
	return (
		<div className="SignedInNavLinks main-links" data-testid="signed-in-nav-links">
			<div
				className="nav-bar"
				onClick={(e) => {
					setTastingId('tasting');
				}}
			>
				<L18nText id="nav_tasting" defaultMessage="Tastings" />
				<span className="SiteMenu__Chevron">
					{id === 'tasting' ? <ChevronIconUp /> : <ChevronIconDown />}
				</span>
				{id === 'tasting' && (
					<div className="SubNav__Wrapper">
						{subMenuItems['tasting'].items.map((item, index) => (
							<div className="SubNav__Item" onClick={closeSideNav}>
								<Link key={index} to={item.link}>
									<L18nText id={item.name} defaultMessage={item.defaultMessage} />
								</Link>
							</div>
						))}
						<div className="SubNav__Item" onClick={closeSideNav}>
							<a href="https://noteable.co/definitions/">
								<L18nText id="nav_definitions" defaultMessage="Definitions" />
							</a>
						</div>
					</div>
				)}
			</div>
			{fullVersionMode ? (
				<div
					className="nav-bar"
					onClick={(e) => {
						setTastingId('allEvent');
					}}
				>
					<L18nText id="nav_event" defaultMessage="Event" />
					<span className="SiteMenu__Chevron">
						{id === 'allEvent' || id === 'event' ? <ChevronIconUp /> : <ChevronIconDown />}
					</span>
					{id === 'allEvent' && (
						<div className="SubNav__Wrapper">
							{subMenuItems[id].items.map((item, index) => (
								<div className="SubNav__Item" onClick={closeSideNav}>
									<Link key={index} to={item.link}>
										<L18nText id={item.name} defaultMessage={item.defaultMessage} />
									</Link>
								</div>
							))}
						</div>
					)}
				</div>
			) : (
				<div className="nav-bar" onClick={closeSideNav}>
					<Link to="/events">
						<L18nText id="nav_event" defaultMessage="Event" />
					</Link>
				</div>
			)}
			{!isProductionSite() && (
				<div className="nav-bar" onClick={closeSideNav}>
					<Link to={routeConstants.MY_TEAMS}>
						<L18nText id="nav_teams" defaultMessage="Teams" />
					</Link>
				</div>
			)}
			{/* {fullVersionMode && (
				<div
					className="nav-bar"
					onClick={(e) => {
						setTastingId('team');
					}}
				>
					<L18nText id="nav_team" defaultMessage="Team" />
					<span className="SiteMenu__Chevron">
						{id === 'team' ? <ChevronIconUp /> : <ChevronIconDown />}
					</span>
					{id === 'team' && (
						<div className="SubNav__Wrapper">
							{subMenuItems['team'].items.map((item, index) => (
								<div className="SubNav__Item" onClick={closeSideNav}>
									<Link key={index} to={item.link}>
										<L18nText id={item.name} defaultMessage={item.defaultMessage} />
									</Link>
								</div>
							))}
						</div>
					)}
				</div>
			)} */}
			{navBar &&
				navBar.items &&
				navBar.items.map((item, index) => {
					return item.children.length ? (
						<div
							key={index}
							className="nav-bar"
							onClick={(e) => {
								setTastingId(item.title);
							}}
						>
							<span>{item.title}</span>
							<span className="SiteMenu__Chevron">
								{id === item.title ? <ChevronIconUp /> : <ChevronIconDown />}
							</span>
							{id === item.title && (
								<div className="SubNav__Wrapper">
									{item.children.map((item, index) => (
										<div className="SubNav__Item">
											<a key={index} href={item.url} target="_top" rel="noopener noreferrer">
												{item.title}
											</a>
										</div>
									))}
								</div>
							)}
						</div>
					) : (
						<div key={index} className="nav-bar">
							<a href={`${item.url}`} target="_top">
								{item.title}
							</a>
						</div>
					);
				})}
		</div>
	);
};

SignedInNavLinks.propTypes = {
	setTastingId: PropTypes.func,
	closeSideNav: PropTypes.func.isRequired,
};

export default SignedInNavLinks;
