import React, {Component} from 'react';
import {connect} from 'react-redux';

import {submitForm} from 'actions/multiStepFormActions';
import tasting from 'config/tasting';
import {CommentStep, FormStep, InfoStep, RatingStep} from '../steps';
import MultiStepForm from '../MultiStepForm';

import appearance from 'assets/json/tasting/light/appearance.json';
import nose from 'assets/json/tasting/light/nose.json';
import palate from 'assets/json/tasting/light/palate.json';
import observations from 'assets/json/tasting/light/observations.json';
import info from 'assets/json/tasting/info.json';
import {routeConstants, tastingsConstants} from 'const';

import 'assets/scss/shared/make-tasting-page.scss';
import L18nText from 'components/shared/L18nText';

class Light extends Component {
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
			tastingsConstants.LIGHT
		);

		if (result) {
			const {event} = this.props;
			const redirectUrl = routeConstants.NEW_TASTING_RESULT + (event ? `?event=${event}` : '');
			this.props.history.replace(redirectUrl);
		}
	}

	render() {
		const {multiStepForm} = this.props;
		const tastingSrc = tasting.source['light'];

		const steps = [
			{
				name: <L18nText id="appearance_" defaultMessage="Appearance" />,
				component: (
					<FormStep
						stepKey="appearance"
						data={appearance}
						requiredFields={appearance.required}
						type="box"
					/>
				),
			},
			{
				name: <L18nText id="nose_" defaultMessage="Nose" />,
				component: false, //set component to false to render the substeps
				subSteps: nose.map((noseData, index) => {
					return (
						<FormStep
							stepKey="nose"
							data={noseData}
							name={'step' + (index + 1)}
							isSubStep="true"
							multiple={noseData.isMultiple}
							requiredFields={noseData.required}
						/>
					);
				}),
			},
			{
				name: <L18nText id="palate_" defaultMessage="Palate" />,
				component: false, //set component to false to render the substeps
				subSteps: palate.map((palateData, index) => {
					return (
						<FormStep
							stepKey="palate"
							data={palateData}
							name={'step' + (index + 1)}
							isSubStep="true"
							multiple={palateData.isMultiple}
							requiredFields={palateData.required}
						/>
					);
				}),
			},
			{
				name: <L18nText id="tasting_observations" defaultMessage="Observations" />,
				component: (
					<FormStep
						stepKey="observations"
						requiredFields={observations.required}
						data={observations}
					/>
				),
			},
			{
				name: <L18nText id="tasting_rating" defaultMessage="Rating" />,
				component: <RatingStep stepKey="rating" />,
			},
			{
				name: <L18nText id="tasting_comments" defaultMessage="Comments" />,
				component: <CommentStep stepKey="comments" />,
			},
			{
				name: <L18nText id="tasting_info" defaultMessage="Info" />,
				component: <InfoStep stepKey="info" requiredFields={info.required} name="wine_details" />,
			},
		];

		let message = null;

		if (multiStepForm && multiStepForm.error && multiStepForm.error.message !== null) {
			let classNames = 'status-message';

			if (multiStepForm.error.status === 'success') {
				classNames = 'alert alert-success';
			}

			if (multiStepForm.error.status === 'error') {
				classNames = 'alert alert-danger';
			}

			message = <div className={classNames}>{multiStepForm.error.message}</div>;
		}

		return (
			<div className="mulit-step-form-wrapper">
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

export default connect(mapStateToProps, {submitForm})(Light);
