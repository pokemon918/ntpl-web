import React, {Component} from 'react';
import {connect} from 'react-redux';

import tasting from 'config/tasting';
import info from 'assets/json/tasting/info.json';
import {submitForm} from 'actions/multiStepFormActions';
import {routeConstants, tastingsConstants} from 'const';

import MultiStepForm from '../MultiStepForm';
import {InfoStep, RatingStep} from '../steps';

import 'assets/scss/shared/make-tasting-page.scss';

class Nectar extends Component {
	constructor(props) {
		super(props);
		this.handleFormSubmission = this.handleFormSubmission.bind(this);
	}

	async handleFormSubmission() {
		const {
			offline: {online},
		} = this.props;
		// Do a dummy sending of selectedItems...

		const result = await this.props.submitForm(
			this.props.multiStepForm.selectedItems,
			online,
			tastingsConstants.NECTAR
		);

		if (result) {
			const {event} = this.props;
			const redirectUrl = routeConstants.NEW_TASTING_RESULT + (event ? `?event=${event}` : '');
			this.props.history.replace(redirectUrl);
		}
	}

	render() {
		const {multiStepForm} = this.props;
		const tastingSrc = tasting.source['nectar'];

		const steps = [
			{name: 'Rating', component: <RatingStep stepKey="rating" />},
			{
				name: 'Info',
				component: <InfoStep stepKey="info" requiredFields={info.required} name="wine_details" />,
			},
		];

		let message = null;

		if (multiStepForm && multiStepForm.status !== null && multiStepForm.status.message !== null) {
			let classNames = 'status-message';

			if (multiStepForm.status.status === 'success') {
				classNames = 'alert alert-success';
			}

			if (multiStepForm.status.status === 'error') {
				classNames = 'alert alert-danger';
			}

			message = <div className={classNames}>{multiStepForm.status.message}</div>;
		}

		return (
			<div className="mulit-step-form-wrapper nectar">
				<MultiStepForm
					tastingSrc={tastingSrc}
					showNavigation={true}
					steps={steps}
					formSubmitCallback={this.handleFormSubmission}
				/>
				{message}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user,
		offline: state.offline,
		multiStepForm: state.multiStepForm,
	};
}

export default connect(mapStateToProps, {submitForm})(Nectar);
