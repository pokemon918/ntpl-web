import React, {Component} from 'react';
import {connect} from 'react-redux';

import Grid from 'components/shared/ui/Grid';
import Button from 'components/shared/ui/Button';
import L18nText from 'components/shared/L18nText';
import {routeConstants} from 'const';

import './chargify.scss';

class PaymentProfile extends Component {
	constructor(props) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
		this.chargifyForm = React.createRef();
		this.state = {token: '', name: '', email: '', data: ''};
	}

	handleSubmit(e) {
		e.preventDefault();

		this.chargify.token(
			this.chargifyForm.current,

			(token) => {
				this.setState({token});
			},

			(error) => {
				console.log('{host} token ERROR - err: ', error);
			}
		);
	}

	componentDidMount() {
		if (this.props.user) {
			const {name, email} = this.props.user;
			this.setState({name: name, email: email});
		}
		this.chargify = new window.Chargify();

		this.chargify.load({
			// (i.e. '1a2cdsdn3lkn54lnlkn')
			publicKey: 'chjs_fgn4y5tb28s42k8vjnb45vf7',

			// form type (possible values: 'card', 'bank' or 'gocardless')
			type: 'card',

			// points to your Chargify site
			serverHost: 'https://noteable.chargify.com',

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

				// `field` is the container for each field

				// `input` is the input HTML element
				input: {
					fontFamily: 'Raleway',
					color: '#391d4d',
					fontSize: '18px',
					border: 'none',
					borderBottom: '1.5px solid #b0a5b8',
					backgroundColor: 'transparent',
					outline: 'none',
					fontWeight: 600,
				},

				// `label` is the label container
				label: {
					color: '#391d4d',
				},

				// `message` is the invalid message container
				message: {
					color: 'red',
					paddingTop: '2px',
					paddingBottom: '1px',
				},
			},

			// use this option if you want to include each field
			// in the separate iframe
			fields: {
				number: {
					selector: '#chargifyCreditCard',
					label: 'Number',
					required: true,
					placeholder: 'xxxx xxxx xxxx xxxx',
					message: 'This field is not valid. Please update it.',
				},

				month: {
					selector: '#chargifyMonth',
					label: 'Mon',
					placeholder: 'mm',
					required: true,
					message: 'This field is not valid. Please update it.',
				},

				year: {
					selector: '#chargifyYear',
					label: 'Year',
					placeholder: 'yyyy',
					required: true,
					message: 'This field is not valid. Please update it.',
				},

				cvv: {
					selector: '#chargifyCvv',
					label: 'CVV code',
					placeholder: '123',
					required: true,
					message: 'This field is not valid. Please update it.',
				},
			},
		});
	}

	componentWillUnmount() {
		this.chargify.unload();
	}

	onHandleChange = (value, key) => {
		this.setState({[key]: value});
	};

	onBack = () => {
		this.props.history.replace(routeConstants.SUBSCRIPTION);
	};

	render() {
		const {name, email, token} = this.state;

		return (
			<form onSubmit={this.handleSubmit} ref={this.chargifyForm}>
				{!token && (
					<div>
						<Grid columns={6}>
							<div>
								<Grid columns={12}>
									<div className="title-header">
										Update: Payment Information {`${name} (${email})`}
									</div>
								</Grid>
								<Grid columns={12}>
									<div id="chargifyCreditCard"></div>
									<div id="chargifyCvv"></div>
								</Grid>

								<Grid columns={12}>
									<div id="chargifyMonth"></div>
									<div id="chargifyYear"></div>
								</Grid>
							</div>
						</Grid>

						<Button variant="default" onHandleClick={this.onToggleModal}>
							<L18nText id="app.update" defaultMessage="Update" />
						</Button>
					</div>
				)}
			</form>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user.userData,
	};
}

export default connect(mapStateToProps)(PaymentProfile);
