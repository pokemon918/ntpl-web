import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import L18nText from 'components/shared/L18nText';
import Button from 'components/shared/ui/Button';

import {subscriptionTab} from './subscriptionData';
import './Subscription.scss';

const [basicPlan, proPlan, scholarPlan] = subscriptionTab;

const SubscriptionSelectMobile = ({highlightPlan, onSelectPlan}) => {
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
		<div className="SubscriptionItemMobile__Wrapper">
			<div className="SubscriptionItem__Title">
				<div className="SubscriptionItem__Title__Header">
					<L18nText id="subscription_select_title" />
				</div>
				<div className="SubscriptionItem__Title__SubHeader">
					<L18nText id="subscription_select_description" />
				</div>
			</div>
			<div className="SubscriptionItem__Level">
				<div className={activeClassFirst}>
					<Button onHandleClick={() => onSelectPlan(basicPlan)}>
						<L18nText id="subscription_plan_buy_basic" />
					</Button>
				</div>
				<div className={activeClassMiddle}>
					<Button onHandleClick={() => onSelectPlan(proPlan)}>
						<L18nText id="subscription_plan_buy_pro" />
					</Button>
				</div>
				<div className={activeClassLast}>
					<Button onHandleClick={() => onSelectPlan(scholarPlan)}>
						<L18nText id="subscription_plan_buy_scholar" />
					</Button>
				</div>
			</div>
		</div>
	);
};

SubscriptionSelectMobile.propTypes = {
	highlightPlan: PropTypes.string,
	onSelectPlan: PropTypes.func,
};

SubscriptionSelectMobile.defaultProps = {
	onSelectPlan: () => {},
};

export default SubscriptionSelectMobile;
