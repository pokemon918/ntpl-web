import React, {Component} from 'react';
import {connect} from 'react-redux';

import Modal from 'components/shared/ui/Modal';
import {BoxSelectionGroup, ListSelection} from '../partials';
import {initStepData} from 'actions/multiStepFormActions';
import SubSection from 'components/shared/ui/SubSection';
import {updateStepSelections} from 'actions/multiStepFormActions';
import L18nText from 'components/shared/L18nText';
import Button from 'components/shared/ui/Button';
import logic from 'assets/json/tasting/logic.json';

import './FormStep.scss';

const Selectors = ({
	content,
	subtitle,
	selectedTitle,
	onCloseModal,
	multiple,
	breadcrumb,
	renderProgressBar,
}) => (
	<div className="Selectors__Container">
		<Modal
			progressBar={renderProgressBar}
			onClose={onCloseModal}
			body={
				<div>
					<Modal.Breadcrumb path={breadcrumb} />

					<Modal.SubTitle text={subtitle} />

					<Modal.Title text={<L18nText id={selectedTitle} defaultMessage="Select" />} />
					{content}
				</div>
			}
			footer={
				<div className="pd-10">
					<Button variant="primary" onHandleClick={onCloseModal}>
						<L18nText id={multiple ? 'app_done' : 'app_close'} defaultMessage="Done" />
					</Button>
				</div>
			}
		/>
	</div>
);

class FormStep extends Component {
	constructor(props) {
		super(props);
		this.getContent = this.getContent.bind(this);
		this.state = {
			openSelectorModal: false,
		};
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		const {data, isSubStep, name, multiStepForm, stepKey} = this.props;
		const {tastingSrc, tastingType, selectedItems} = multiStepForm;
		let step = multiStepForm.steps[stepKey];

		if (isSubStep) {
			if (step === undefined || step.subSteps === undefined || step.subSteps[name] === undefined) {
				this.props.initStepData(
					tastingSrc,
					stepKey,
					data,
					isSubStep,
					name,
					tastingType,
					selectedItems
				);
			}
		} else {
			if (step === undefined || (Object.keys(step).length === 0 && step.constructor === Object)) {
				this.props.initStepData(tastingSrc, stepKey, data, null, null, tastingType, selectedItems);
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		const {data, isSubStep, name, multiStepForm, stepKey} = nextProps;
		const {tastingSrc, tastingType, selectedItems} = multiStepForm;
		let step = multiStepForm.steps[stepKey];

		if (isSubStep) {
			if (step === undefined || step.subSteps === undefined || step.subSteps[name] === undefined) {
				this.props.initStepData(
					tastingSrc,
					stepKey,
					data,
					isSubStep,
					name,
					tastingType,
					selectedItems
				);
				return false;
			}
		} else {
			if (step === undefined || (Object.keys(step).length === 0 && step.constructor === Object)) {
				this.props.initStepData(tastingSrc, stepKey, data);
				return false;
			}
		}

		return true;
	}

	closeSelectorModal = () => {
		this.setState({openSelectorModal: false});
	};

	getContent() {
		let {
			isSubStep,
			name,
			multiple,
			stepKey,
			multiStepForm,
			type,
			customAction,
			hideArrow,
		} = this.props;

		let step = multiStepForm.steps[stepKey];
		let stepData = {};
		let content = null;
		const {openSelectorModal} = this.state;

		if (step) {
			stepData = step.stepData;

			if (isSubStep && step.subSteps && step.subSteps[name]) stepData = step.subSteps[name].data;
		}

		if (type && type === 'box') {
			content = <BoxSelectionGroup step={stepKey} data={stepData} customAction={customAction} />;
		} else {
			content = (
				<ListSelection
					step={stepKey}
					isSubStep={isSubStep}
					name={name}
					data={stepData}
					selectorModalStatus={openSelectorModal}
					closeSelectorModal={this.closeSelectorModal}
					multiple={multiple}
					customAction={customAction}
					hideArrow={hideArrow}
				/>
			);
		}

		return content;
	}

	handleSelectionSelect = (selectionKey) => {
		let {isSubStep, name, stepKey, multiStepForm} = this.props;
		let step = multiStepForm.steps[stepKey];
		let stepData = {};

		if (step) {
			stepData = step.stepData;

			if (isSubStep) stepData = step.subSteps[name].data;
		}

		const {selections, activeSelection} = stepData;
		let newActiveSelection = null;
		let newSelections = [];
		activeSelection.isActive = false; // set the previous active selection to false
		// set active selection
		selections.forEach((selection, index) => {
			let tempSelection = Object.assign({}, selection);
			newSelections.push(tempSelection);
			tempSelection.isActive = false;

			if (tempSelection.key === selectionKey) {
				tempSelection.isActive = true;
				newActiveSelection = {...tempSelection};
			}
		});

		this.props.updateStepSelections(
			this.props.stepKey,
			{
				selections: newSelections,
				activeSelection: newActiveSelection,
			},
			isSubStep,
			name
		);

		this.setState({selectedTitle: newActiveSelection.key});
		this.setState({openSelectorModal: true});
	};

	renderProgressBar = () => {
		const {
			multiStepForm: {progressPercent},
		} = this.props;

		return (
			<>
				<div className="ProgressBar__Wrapper">
					<div className="ProgressBar__Value" style={{width: `${progressPercent}%`}} />
				</div>
			</>
		);
	};

	getSelectionList = (selections) => {
		selections.filter((item) => {
			const selectedItem = logic[item.key] && logic[item.key]['notif'];

			return selectedItem && selectedItem.find((selection) => selection === item.key);
		});

		return selections;
	};

	render() {
		const {openSelectorModal, selectedTitle} = this.state;
		const {breadcrumb, title, subtitle, subHeader} = this.props.data;
		const content = this.getContent();

		if (
			(this.props.directionNav &&
				this.props.stepKey === 'nose' &&
				content.props.data.selections &&
				content.props.data.selections.length > 0 &&
				content.props.data.selections[0].hideSelection) ||
			(this.props.stepKey === 'palate' && content.props.data.selections[0].hideSelection)
		) {
			this.props.directionNav();
		}

		let {stepKey, multiple, multiStepForm, isSubStep, name, type = ''} = this.props;

		let step = multiStepForm.steps[stepKey];
		let stepData = {};

		if (step) {
			stepData = step.stepData;

			if (isSubStep && step.subSteps) stepData = step.subSteps[name].data;
		}

		let {selections = [], activeSelection} = stepData;

		let header = '';

		if (multiStepForm.tastingType === 'quick' || type === 'box') {
			header = title;
		}

		if (
			(type !== 'box' && multiStepForm.tastingType === 'profoundMobile') ||
			multiStepForm.tastingType === 'scholar2m' ||
			multiStepForm.tastingType === 'scholar3m' ||
			multiStepForm.tastingType === 'scholar4m'
		) {
			header = activeSelection && activeSelection.key;
		}

		const selectionList = this.getSelectionList(selections, multiStepForm);

		return (
			<div className="step-container">
				{openSelectorModal && (
					<Selectors
						renderProgressBar={this.renderProgressBar}
						breadcrumb={breadcrumb}
						multiple={multiple}
						subtitle={subtitle || 'Select any one you like'}
						content={content}
						onCloseModal={this.closeSelectorModal}
						selectedTitle={selectedTitle}
					/>
				)}
				<Modal.Breadcrumb path={breadcrumb} />
				<Modal.Title
					text={
						multiStepForm.tastingType === 'quick' ||
						multiStepForm.tastingType === 'swa20' ||
						type === 'box' ||
						multiStepForm.tastingType === 'profoundMobile' ||
						multiStepForm.tastingType === 'scholar2m' ||
						multiStepForm.tastingType === 'scholar3m' ||
						multiStepForm.tastingType === 'scholar4m' ? (
							header
						) : (
							<SubSection
								items={selectionList}
								multiple={multiple}
								type={multiStepForm.tastingType}
								handleOptionSelect={this.handleSelectionSelect}
							/>
						)
					}
				/>
				<Modal.SubTitle
					text={
						subHeader || subtitle ? (
							<div>
								{subHeader && (
									<div className="Selectors_SubHeader">
										<L18nText id={subHeader} />
									</div>
								)}
								{subHeader && subtitle && <br />}
								{subtitle && <L18nText id={subtitle} defaultMessage="Done" />}
							</div>
						) : null
					}
				/>
				{(type && type === 'box') ||
				multiStepForm.tastingType === 'quick' ||
				multiStepForm.tastingType === 'swa20' ||
				multiStepForm.tastingType === 'profoundMobile' ||
				multiStepForm.tastingType === 'scholar2m' ||
				multiStepForm.tastingType === 'scholar3m' ||
				multiStepForm.tastingType === 'scholar4m' ? (
					<div>{content}</div>
				) : (
					<div className="Selectors__Container__Desktop">{content}</div>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		multiStepForm: state.multiStepForm,
	};
}

export default connect(mapStateToProps, {initStepData, updateStepSelections})(FormStep);
