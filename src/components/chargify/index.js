import React, {Component} from 'react';
import {connect} from 'react-redux';
import queryString from 'query-string';

import {chargifyConstants, routeConstants} from 'const';
import Grid from 'components/shared/ui/Grid';
import Button from 'components/shared/ui/Button';
import L18nText from 'components/shared/L18nText';
import TextInput from 'components/shared/ui/TextInput';

import {setPaymentMode} from 'actions/appActions';
import {createSubscription} from 'actions/userActions';
import './chargify.scss';
import Spinner from '../shared/ui/Spinner';

class ChargifyForm extends Component {
	state = {
		token: '',
		firstName: '',
		email: '',
		lastName: '',
		selectedPlan: '',
		isLoading: false,
		gettingToken: false,
	};

	chargifyForm = React.createRef();

	componentWillMount() {
		const {info, selectedPlan, isAuthenticated, user} = this.props;

		if (info) {
			this.setState({firstName: info.firstName, lastName: info.lastName, email: info.email});
		}

		if (selectedPlan) {
			this.setState({selectedPlan});
		} else {
			const {plan} = queryString.parse(this.props.location.search);
			this.setState({selectedPlan: plan});
		}

		if (isAuthenticated && user.name) {
			const [firstName, ...otherNames] = user.name.trim().split(' ');
			const lastName = otherNames.join(' ');

			this.setState({firstName, lastName, email: user.email});
		}
	}

	createSubscription = async () => {
		const {selectedPlan, token} = this.state;

		if (this.props.onNext) {
			await this.props.onNext();
			await this.props.createSubscription(selectedPlan, token);
			this.props.setPaymentMode(true);

			return;
		}

		this.props.history.replace(`${routeConstants.HOME}${window.location.search}`);
	};

	handleSubmit = async (e) => {
		const {token, gettingToken} = this.state;

		this.setState({isLoading: true});

		e.preventDefault();

		if (!gettingToken && token) {
			this.createSubscription();
		} else {
			this.getToken(this.createSubscription);
		}
	};

	onBack = () => {
		const {isAuthenticated, onBack} = this.props;

		if (isAuthenticated) {
			return this.props.history.replace(`${routeConstants.BILLING}${this.props.location.search}`);
		}

		return onBack();
	};

	async componentDidMount() {
		this.chargify = new window.Chargify();

		await this.chargify.load({
			// (i.e. '1a2cdsdn3lkn54lnlkn')
			publicKey: chargifyConstants.publicKey,

			// form type (possible values: 'card', 'bank' or 'gocardless')
			type: 'card',

			// points to your Chargify site
			serverHost: `https://${chargifyConstants.domain}.chargify.com`,

			// flag to show/hide the credit card image
			// true: hides the credit card image
			// visible otherwise
			hideCardImage: false,

			// required label/translation (i.e. '*') for required fields
			// Especially useful if you use 'fields' option
			requiredLabel: '*',
			style: {
				// to style an iframe, use the iframe's container selector
				'#chargify-form': {border: '1px dashed #ffc0cb57'},
				fields: {
					margin: '-20px 0px !important',
				},
				// `field` is the container for each field
				// `input` is the input HTML element
				input: {
					fontFamily: 'Raleway, sans-serif',
					color: '#391d4d',
					fontSize: '18px',
					border: 'none',
					borderBottom: '1.5px solid #b0a5b8',
					backgroundColor: 'transparent',
					borderRadius: '0px',
					outline: 'none',
					fontWeight: 600,
					placeholder: {
						color: '#391d4d',
						fontFamily: 'Raleway, sans-serif',
						fontWeight: 'normal',
					},
				},

				// `label` is the label container
				label: {
					fontFamily: 'Raleway, sans-serif',
					fontSize: '14px',
					marginBottom: '0px',
					color: '#b0a5b8',
					fontWeight: 300,
				},

				// `message` is the invalid message container
				message: {
					color: 'red',
					fontFamily: 'Raleway, sans-serif',
				},
			},

			// use this option if you want to include each field
			// in the separate iframe
			fields: {
				number: {
					selector: '#chargifyCreditCard',
					label: 'Card Number',
					color: '#391d4d',
					placeholder: 'xxxx xxxx xxxx xxxx',
					message: 'This field is not valid. Please update it.',
				},

				month: {
					selector: '#chargifyMonth',
					label: 'Month',
					placeholder: 'MM',
					message: 'This field is not valid. Please update it.',
					style: {
						input: {
							padding: 0,
						},
					},
				},

				year: {
					selector: '#chargifyYear',
					label: 'Year',
					placeholder: 'YYYY',
					message: 'This field is not valid. Please update it.',
					style: {
						input: {
							padding: 0,
						},
					},
				},
				cvv: {
					selector: '#chargifyCvv',
					label: 'CVV',
					required: true,
					message: 'This field is not valid. Please update it.',
					style: {
						input: {
							padding: 0,
						},
					},
				},
			},
		});
		window.scrollTo(0, 0);
	}

	componentWillUnmount() {
		this.chargify.unload();
	}

	getToken = (callback = null) => {
		this.setState({gettingToken: true});
		this.chargify.token(
			this.chargifyForm.current,

			async (token) => {
				this.setState({gettingToken: false, token});

				if (callback) {
					callback();
				}
			},

			(error) => {
				console.log('{host} token ERROR - err: ', error);
				this.setState({gettingToken: false, isLoading: false});
			}
		);
	};

	onHandleChange = (value, key) => {
		const {gettingToken, token} = this.state;

		if (!gettingToken && !token) {
			this.getToken();
		}

		this.setState({[key]: value});
	};

	isValid = () => {
		const {firstName, lastName, email} = this.state;

		if (firstName && lastName && email) {
			return true;
		}

		return false;
	};

	render() {
		const {firstName, lastName, email} = this.state;

		return (
			<Grid columns={6}>
				<div>
					{this.state.isLoading && <Spinner />}
					<form onSubmit={this.handleSubmit} ref={this.chargifyForm}>
						<div className="Payment__Title">
							<L18nText id="subscription_no_bill" defaultMessage="You will not be billed today" />
						</div>
						<div className="Payment__SubTitle">
							<L18nText id="app_credit_info" defaultMessage="Payment details" />
						</div>
						<div className="Payment__Chargify__Wrapper" id="Payment__Container">
							<div id="chargifyCreditCard" className="chargify__Item"></div>

							<div id="chargifyMonth" className="chargify__Item"></div>
							<div id="chargifyYear" className="chargify__Item"></div>
							<div id="chargifyZip" className="chargify__Item"></div>
							<div id="chargifyCvv" className="chargify__Item"></div>
						</div>
						<div className="Payment__SubTitle">
							<L18nText id="subscription_billing_info" defaultMessage="Billing information" />
						</div>
						<div className="Payment__UserInfo">
							<div id="chargifyFirstName">
								<TextInput
									label={'subscription_firstname'}
									type="text"
									value={firstName || ''}
									onChange={this.onHandleChange}
									infoKey={'firstName'}
								/>
							</div>
							<div id="chargifyLastName">
								<TextInput
									label={'subscription_lastname'}
									type="text"
									value={lastName || ''}
									onChange={this.onHandleChange}
									infoKey={'lastName'}
								/>
							</div>
							<div id="chargifyEmailName">
								<TextInput
									label={'subscription_email'}
									type="text"
									value={email || ''}
									onChange={this.onHandleChange}
									infoKey={'email'}
								/>
							</div>
						</div>
						<div className="Payment__UserInfo_Buttons">
							<Button variant="outlined" onHandleClick={this.onBack}>
								<L18nText id="tasting_nav_back" defaultMessage="Back" />
							</Button>
							<Button variant="default" disabled={!this.isValid()} type="submit">
								<L18nText id="subscription_save_details" defaultMessage="Save payment details" />
							</Button>
						</div>
					</form>
				</div>
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user.userData,
		isAuthenticated: state.user.isLoggedIn,
	};
}

export default connect(mapStateToProps, {setPaymentMode, createSubscription})(ChargifyForm);
