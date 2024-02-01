import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {routeConstants} from 'const';
import L18nText from 'components/shared/L18nText';

import {ReactComponent as ChevronIconUp} from './Icon_ChevronUp.svg';
import {ReactComponent as ChevronIconDown} from './Icon_ChevronDown.svg';

const SignedOutNavLinks = (props) => (
	<div className="SignedOutNavLinks main-links" data-testid="signed-out-nav-links">
		{null && (
			<Link
				to={routeConstants.SUBSCRIPTION}
				onClick={(e) => {
					props.closeSideNav();
				}}
			>
				<L18nText id="subscription_name" defaultMessage="Subscription" />
			</Link>
		)}
		{props.navBar &&
			props.navBar.items &&
			props.navBar.items.map((item, index) => {
				return item.children.length ? (
					<div
						key={index}
						className="nav-bar"
						onClick={(e) => {
							props.setTastingId(item.title);
						}}
					>
						<span>{item.title}</span>
						<span className="SiteMenu__Chevron">
							{props.id === item.title ? <ChevronIconUp /> : <ChevronIconDown />}
						</span>
						{props.id === item.title && (
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
						<a href={item.url} target="_top" rel="noopener noreferrer">
							{item.title}
						</a>
					</div>
				);
			})}
	</div>
);

SignedOutNavLinks.propTypes = {
	closeSideNav: PropTypes.func.isRequired,
};

export default SignedOutNavLinks;
