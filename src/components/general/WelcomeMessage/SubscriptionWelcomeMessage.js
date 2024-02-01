/* global globalThis */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import './SubscriptionWelcomeMessage.scss';
import Grid from '../../shared/ui/Grid';
import L18nText from 'components/shared/L18nText';
import {ReactComponent as Stars} from './Stars.svg';
import Button from 'components/shared/ui/Button';
//import {onRedirectToEvent} from 'commons/shared';
import {routeConstants} from 'const';

class SubscriptionWelcomeMessage extends Component {
	componentWillUnmount() {
		globalThis && globalThis.window && globalThis.window.scrollTo(0, 0);
	}

	componentDidMount() {
		let event = 'CompleteRegistration';
		if (globalThis && globalThis.fbq) {
			globalThis.fbq('track', event);
			console.dir(event + ' OK');
		} else console.dir(event + ' not OK');
	}

	render() {
		const {activePlan, futurePlan} = this.props;
		const hasFreeUpgrade = activePlan === 'pro' && futurePlan === 'basic';
		// const originalPlan = futurePlan || activePlan;
		// const activePlanName = <L18nText id={`subscription_plan_${originalPlan}`} />;

		return (
			<div className="GetStart_Container_Subscription">
				<Grid columns={8}>
					<div className="GetStart_Wrap">
						<div className="GetStart__Upper">
							<div className="GetStart__Header">
								<div className="GetStart__Title">
									<L18nText id="start_thank_you" defaultMessage="Thank you so much ..." />
								</div>
								{/* Needs to show later after the demo */}
								{/* <div className="GetStart__SubTitle">
									<L18nText id="start_welcome" values={{activePlanName}} />
								</div> */}
							</div>

							<div className="GetStart__Summary">
								{/*
								<div className="GetStart__Summary__Title">
									<L18nText id="subscription_summary" defaultMessage="Summary" />
								</div>
								<div>
									{subscriptionType ? subscriptionType.name : 'N/A'}
									<L18nText id="subscription" defaultMessage="Subscription" />
								</div>
								<div>Monthly payments of {subscriptionType && subscriptionType.price} EUR</div>
								<div>
									<L18nText id="subscription_start_date" defaultMessage="Start date:" /> {startDate}
								</div>
								<div>
									<L18nText id="subscription_payment_date" defaultMessage="Next Payment:" />{' '}
									{nextDate}
								</div>
							*/}
							</div>
							{hasFreeUpgrade && (
								<div className="GetStart__Free">
									<div className="GetStart__Free__Icon">
										<Stars />
									</div>
									<div className="GetStart__Free__Info">
										<div className="GetStart__Free__Info__Title">
											<L18nText
												id="subscription_free_upgrade"
												defaultMessage="You got a free upgrade!"
											/>
										</div>
										<div className="GetStart__Free__Info__SubTitle">
											<L18nText
												id="subscription_next_30"
												defaultMessage="For the next 30 days you have access to features normally only included in the
										Pro subscription."
											/>
										</div>
									</div>
								</div>
							)}
						</div>
						<div className="GetStart_Wrapper">
							<p>
								<L18nText id="start_how_intro" defaultMessage="Thank you very much" />{' '}
								<L18nText id="start_how_to_start" defaultMessage="Here’s how to get started!" />
							</p>

							<h5>Tastings</h5>
							<ol className="GetStart_List">
								<li className="GetStart_List_Item">
									{/* MRW: We will fiks the l18n later */}
									Click <b>New Tasting</b> below or in the menu
									<div className="SiteHeader_Hamburger">
										<div className="SiteHeader_Hamburger_Item" />
										<div className="SiteHeader_Hamburger_Item" />
										<div className="SiteHeader_Hamburger_Item" />
									</div>
								</li>
								<li className="GetStart_List_Item">
									Choose your <b>tasting method</b>
								</li>
								<li className="GetStart_List_Item">
									Let Noteable <b>guide you</b> through your tasting
								</li>
								<li className="GetStart_List_Item">
									Save your <b>tasting summary</b>
								</li>
								<li className="GetStart_List_Item">
									Look up your previous tastings any time under <b>'My Tastings'</b>
								</li>
							</ol>
							<h5>Events</h5>
							<ol className="GetStart_List">
								<li className="GetStart_List_Item">
									Choose 'Events' in the menu
									<div className="SiteHeader_Hamburger">
										<div className="SiteHeader_Hamburger_Item" />
										<div className="SiteHeader_Hamburger_Item" />
										<div className="SiteHeader_Hamburger_Item" />
									</div>
								</li>
								<li className="GetStart_List_Item">
									Find your event by searcing with the event code
								</li>
								<li className="GetStart_List_Item">Click the event and request to join</li>
							</ol>

							<p>We hope you have lots of great tastings</p>
							<p>Cheers</p>
							<p>&nbsp;</p>

							<div className="GetStarted__Footer">
								<Link to={routeConstants.NEW_TASTING} className="GetStart_Link">
									<Button variant="reverse" infoKey="nav_newTasting" data-test="nav_newTasting">
										<L18nText id="tasting_nav_start" defaultMessage="New tasting" />
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</Grid>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		activePlan: state.user.activePlan,
		futurePlan: state.user.futurePlan,
	};
}

export default connect(mapStateToProps)(SubscriptionWelcomeMessage);
