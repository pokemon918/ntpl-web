import React from 'react';
import classNames from 'classnames';

import './Subscription.scss';
import L18nText from 'components/shared/L18nText';

const SubscriptionTab = ({title, highlightPlan}) => {
	const subscriptionClass = classNames('SubscriptionItem__Description header ', {
		'active-header': highlightPlan,
	});

	return (
		<div className={subscriptionClass}>
			<L18nText id={title} defaultMessage={title} />
		</div>
	);
};

export default SubscriptionTab;
