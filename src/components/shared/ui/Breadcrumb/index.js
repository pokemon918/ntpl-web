import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {FaChevronRight} from 'react-icons/fa';

import L18nText from 'components/shared/L18nText';
import './Breadcrumb.scss';
import {routeConstants} from 'const';

const splitBreadcrumbPath = (path) => {
	if (typeof path !== 'string') return [];
	return path.split('/').map((i) => i.trim());
};

const urlGenerator = {
	nav_myTasting: routeConstants.MY_TASTINGS,
	events: routeConstants.EVENTS,
	subscription_back_to_profile: `${routeConstants.PROFILE}?subscription`,
};

const CustomizedContent = ({item}) => {
	if (!item) {
		return null;
	}

	const lastIndex = item.lastIndexOf(', ');

	const lastText = item.substring(lastIndex + 1, item.length);
	const startText = item.substring(0, lastIndex);

	return (
		<span>
			{startText}
			<b>{lastText}</b>
		</span>
	);
};

const Breadcrumb = ({path, boldLastText}) => (
	<>
		<div className="Breadcrumb__Container">
			{splitBreadcrumbPath(path).map((item, index) => (
				<React.Fragment key={index}>
					{index > 0 && (
						<span className="Breadcrumb__Separator">
							<FaChevronRight />
						</span>
					)}
					{urlGenerator[item] ? (
						<span className="Breadcrumb__Item">
							<Link to={urlGenerator[item]}>
								<L18nText id={item} defaultMessage={item} />
							</Link>
						</span>
					) : (
						<span className="Breadcrumb__Item">
							{boldLastText ? (
								<CustomizedContent item={item} />
							) : (
								<L18nText id={item} defaultMessage={item} />
							)}
						</span>
					)}
				</React.Fragment>
			))}
		</div>
		&nbsp;
	</>
);

Breadcrumb.propTypes = {
	path: PropTypes.string,
};

export default Breadcrumb;
