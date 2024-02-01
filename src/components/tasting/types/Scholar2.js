import React, {Component} from 'react';
import {connect} from 'react-redux';

import DialogBox from 'components/shared/ui/DialogBox';
import {submitForm} from 'actions/multiStepFormActions';
import appearance from 'assets/json/tasting/scholar2/appearance.json';
import nose from 'assets/json/tasting/scholar2/nose.json';
import palate from 'assets/json/tasting/scholar2/palate.json';
import observations from 'assets/json/tasting/scholar2/observations.json';
import info from 'assets/json/tasting/info.json';
import tasting from 'config/tasting';
import {getEventMetadata} from 'reducers/eventsReducer';

import MultiStepForm from '../MultiStepForm';
import {FormStep, InfoStep, MedalStep} from '../steps';

import 'assets/scss/shared/make-tasting-page.scss';
import {routeConstants, tastingsConstants} from 'const';
import L18nText from 'components/shared/L18nText';
import TastingNoteStep from '../steps/TastingNoteStep';

class Scholar2 extends Component {
	constructor(props) {
		super(props);
		this.initState = props.event ? props.multiStepForm.selectedItems : null;
		this.handleFormSubmission = this.handleFormSubmission.bind(this);
	}
	state = {
		showWarning: true,
	};

	onClose = () => {
		this.setState({showWarning: false});
	};

	backToSelectTasting = () => {
		this.setState({showWarning: false});
		this.props.history.push(`${routeConstants.TASTING}`);
	};

	async handleFormSubmission() {
		const {
			offline: {online},
		} = this.props;
		// Do a dummy sending of selectedItems...

		const result = await this.props.submitForm(
			this.props.multiStepForm.selectedItems,
			online,
			tastingsConstants.SCHOLAR2
		);

		if (result) {
			const {event} = this.props;
			const redirectUrl = routeConstants.NEW_TASTING_RESULT + (event ? `?event=${event}` : '');
			this.props.history.replace(redirectUrl);
		}
	}

	render() {
		const {multiStepForm, eventMetadata} = this.props;
		const {showWarning} = this.state;

		const tastingSrc = tasting.source['scholar2'];

		const steps = [
			{
				name: <L18nText id="appearance_" defaultMessage="Appearance" />,
				component: (
					<FormStep
						stepKey="appearance"
						data={appearance}
						requiredFields={appearance.required}
						name={'step' + 1}
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
				name: <L18nText id="tasting_note" defaultMessage="Tasting Note" />,
				component: <TastingNoteStep stepKey="tasting_note" name="tasting_note" />,
			},
			{
				name: <L18nText id="tasting_info" defaultMessage="Info" />,
				component: (
					<InfoStep
						stepKey="info"
						initState={this.initState && this.initState.info ? this.initState.info : null}
						requiredFields={info.required}
						name="wine_details"
					/>
				),
			},
		];

		if (eventMetadata && eventMetadata.medal_page) {
			steps.push({
				name: <L18nText id="tasting_medal" defaultMessage="Medal" />,
				component: <MedalStep />,
			});
		}

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
				<div className="mobile-only Profound-page">
					{showWarning && (
						<DialogBox
							title={'Scholar level 2 tasting'}
							errorBox={true}
							hideBtn
							onClose={this.onClose}
							description={
								'The Scholar level 2 tasting is not supported on your device. Please use a computer or an iPad to get the full benefit'
							}
							errorButtonText={'tasting_nav_back'}
							noCallback={this.backToSelectTasting}
						/>
					)}
				</div>
				{message}
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		app: state.app,
		user: state.user,
		offline: state.offline,
		multiStepForm: state.multiStepForm,
		eventMetadata: getEventMetadata(state, ownProps.event),
	};
}

export default connect(mapStateToProps, {submitForm})(Scholar2);
