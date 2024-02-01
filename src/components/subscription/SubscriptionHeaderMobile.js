import React from 'react';
import classNames from 'classnames';

import L18nText from 'components/shared/L18nText';
import './Subscription.scss';

const SubscriptionTitle = ({data, highlightPlan, value, title}) => {
	return (
		<div className="SubscriptionItemMobile__Wrapper header">
			<div className="SubscriptionItem__Title">
				<div className="SubscriptionItem__Title__Header">{title}</div>
			</div>
			<div className="SubscriptionItem__Level">
				{data.map((subscription) => {
					const subscriptionItem = classNames('SubscriptionItem__Price', {
						active: highlightPlan === subscription.id,
					});
					return (
						<div className={subscriptionItem}>
							<L18nText id="subscription_euro_symbol" defaultMessage="€" />
							<span className="SubscriptionItem__Price__Value">
								<L18nText id={subscription.intlPrice} defaultMessage={subscription.price} />
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SubscriptionTitle;
