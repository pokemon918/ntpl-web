import React from 'react';
import classNames from 'classnames';

import './Subscription.scss';
import L18nText from 'components/shared/L18nText';

const SubscriptionTitle = ({data, highlightPlan, title}) => {
	return (
		<div className="SubscriptionItem__Wrapper">
			<div className="SubscriptionItem__Title">
				<div className="SubscriptionItem__Title__Header">
					<L18nText id={title} defaultMessage={title} />
				</div>
			</div>

			{data.map((subscription) => {
				const subscriptionItem = classNames('SubscriptionItem__Description', {
					active: highlightPlan === subscription.id,
				});
				return (
					<div className={subscriptionItem}>
						<span className="SubscriptionItem__Price__Symbol">
							<L18nText id="subscription_euro_symbol" defaultMessage="€" />
						</span>
						<span className="SubscriptionItem__Price__Value">
							<L18nText id={subscription.intlPrice} defaultMessage={subscription.price} />
						</span>
					</div>
				);
			})}
		</div>
	);
};

export default SubscriptionTitle;
