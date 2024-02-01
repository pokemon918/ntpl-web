import React from 'react';
import classNames from 'classnames';
import {FaCheck} from 'react-icons/fa';

import './Subscription.scss';
import L18nText from 'components/shared/L18nText';

const SubscriptionItem = ({title, subTitle, highlightPlan, basic, pro, scholar}) => {
	const activeClassFirst = classNames('SubscriptionItem__Description', {
		active: highlightPlan === 'basic',
	});

	const activeClassMiddle = classNames('SubscriptionItem__Description', {
		active: highlightPlan === 'pro',
	});

	const activeClassLast = classNames('SubscriptionItem__Description', {
		active: highlightPlan === 'scholar',
	});

	return (
		<div className="SubscriptionItem__Wrapper">
			<div className="SubscriptionItem__Title">
				<div className="SubscriptionItem__Title__Header">
					<L18nText id={title} defaultMessage={title} />
				</div>
				<div className="SubscriptionItem__Title__SubHeader">
					<L18nText id={subTitle} defaultMessage={subTitle} />
				</div>
			</div>
			<div className={activeClassFirst}>{basic && <FaCheck />}</div>
			<div className={activeClassMiddle}>{pro && <FaCheck />}</div>
			<div className={activeClassLast}>{scholar && <FaCheck />}</div>
		</div>
	);
};

export default SubscriptionItem;
