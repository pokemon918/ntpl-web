import React, {Component} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';

import ListSelectionOptions from './ListSelectionOptions';
import {
	updateSelectedItem,
	updateStepSelections,
	removeSelectedItem,
} from 'actions/multiStepFormActions';
import tasting from 'config/tasting';

import Grid from 'components/shared/ui/Grid';

// styles
import './ListSelection.scss';
import DialogBox from 'components/shared/ui/DialogBox';
import TextInput from 'components/shared/ui/TextInput';

const getNextStep = {
	step1: 'step2',
	step2: 'step3',
	step3: 'step4',
	step4: 'step5',
};

const getNextStepScholar4 = {
	step1: 'step2',
	step2: 'step3',
};

const getNextItem = {
	winetype_: 'color_',
	color_: 'nuance_tint_',
	nuance_tint_: 'clarity__',
	clarity__: 'colorintensity__',
};

const getNextItemScholar4 = {
	color_: 'nuance_',
	nuance_: 'colorintensity__',
};

const getNextItemScholar2 = {
	color_: 'nuance_',
	nuance_: 'colorintensity__',
};

const getNextItemScholar3 = {
	color_: 'nuance_',
	nuance_: 'clarity__',
	clarity__: 'colorintensity__',
};

class ListSelection extends Component {
	state = {
		displayInputOther: false,
		otherDescriptors: '',
	};

	constructor(props) {
		super(props);
		this.handleOptionSelect = this.handleOptionSelect.bind(this);
		this.setNextSelection = this.setNextSelection.bind(this);
	}

	setInputOtherOpen = () =>
		this.setState({
			displayInputOther: true,
			otherDescriptors: get(
				this.props.multiStepForm,
				'selectedItems.descriptors_other.notes_input_other',
				''
			),
		});

	setInputOtherClosed = () => this.setState({displayInputOther: false, otherDescriptors: ''});

	setOtherDescriptors = (otherDescriptors) => this.setState({otherDescriptors});

	getNextItems = {
		scholar2m: getNextItemScholar2,
		scholar3m: getNextItemScholar3,
		scholar4m: getNextItemScholar4,
	};

	getSelections(propData, multiple = false) {
		let activeSelection = null;
		let data = Object.assign({}, propData);

		const selections = Object.keys(data).map((selection, index) => {
			// Add selection as key to data for tracking
			data[selection].key = selection;
			data[selection].activeOption = null;

			if (multiple) {
				data[selection].activeOption = [];
			}

			if (index === 0) {
				data[selection].isActive = true;
				activeSelection = data[selection];
			}

			return data[selection];
		});

		return {
			selections,
			activeSelection,
		};
	}

	setNextSelection(currentIndex) {
		let {selections} = this.props.data;
		let nextIndex = currentIndex + 1;
		let activeSelection = selections[currentIndex];
		let nextSelection = selections[nextIndex];
		if (nextSelection) {
			if (nextSelection.hideSelection) {
				nextSelection = this.setNextSelection(nextIndex);
			} else {
				activeSelection.isActive = false;
				nextSelection.isActive = true;
			}
		} else {
			activeSelection.isActive = true;
		}

		return nextSelection;
	}

	getIsChecked = (note) => {
		if (note === 'notes_input_other') {
			const otherNotes = get(
				this.props.multiStepForm,
				'selectedItems.descriptors_other.notes_input_other',
				''
			);
			return otherNotes.length > 0;
		}
		return false;
	};

	storeOtherDescriptors = () => {
		const {otherDescriptors} = this.state;
		this.props.updateSelectedItem('descriptors_other', {notes_input_other: otherDescriptors});
		this.setInputOtherClosed();
	};

	handleOptionSelect(value) {
		if (value === 'notes_input_other') {
			this.setInputOtherOpen();
			return;
		}

		const {multiple, selectorModalStatus, closeSelectorModal, multiStepForm} = this.props;
		const tastingSrc = tasting.source[multiStepForm.tastingType];

		let {activeSelection, selections} = this.props.data;

		let nextSelection = null;

		if (!multiple && selectorModalStatus) {
			closeSelectorModal();
		}

		if (multiple) {
			if (activeSelection.activeOption === undefined || activeSelection.activeOption == null)
				activeSelection.activeOption = [];

			if (!activeSelection.activeOption.includes(value)) {
				activeSelection.activeOption.push(value);
			} else {
				activeSelection.activeOption.splice(activeSelection.activeOption.indexOf(value), 1);
			}

			selections.forEach((selection, currentIndex) => {
				if (selection.key === activeSelection.key) {
					selection.activeOption = activeSelection.activeOption;
				}
			});
		} else {
			activeSelection.activeOption = value;

			// Deactivate current selection and activate the next available selections (Only works for single selections)
			selections.forEach((selection, currentIndex) => {
				if (selection.key === activeSelection.key) {
					selection.activeOption = activeSelection.activeOption;
					nextSelection = this.setNextSelection(currentIndex);
				}
			});
		}

		if (selections.length === 1 && this.props.customAction) {
			this.props.customAction();
		} else if (
			this.props.customAction &&
			activeSelection.key &&
			selections[selections.length - 1].key === activeSelection.key
		) {
			this.props.customAction();
		}

		// If nextSelection is set, make it the activeSelection
		if (nextSelection) {
			activeSelection = nextSelection;
		}

		this.props.updateStepSelections(
			this.props.step,
			{selections, activeSelection},
			this.props.isSubStep,
			this.props.name
		);

		if (
			(this.props.multiStepForm.tastingType === 'profoundMobile' ||
				this.props.multiStepForm.tastingType === 'scholar2m' ||
				this.props.multiStepForm.tastingType === 'scholar3m' ||
				this.props.multiStepForm.tastingType === 'scholar4m' ||
				this.props.multiStepForm.tastingType === 'quick') &&
			this.props.step === 'appearance' &&
			getNextItem[activeSelection.key]
		) {
			this.props.updateStepSelections(
				this.props.step,
				{
					selections: [
						{
							activeOption: null,
							hideSelection: true,
							isActive: false,
							key:
								multiStepForm.tastingType === 'scholar4m' ||
								multiStepForm.tastingType === 'scholar3m' ||
								multiStepForm.tastingType === 'scholar2m'
									? this.getNextItems[multiStepForm.tastingType][activeSelection.key]
									: getNextItem[activeSelection.key],
							options:
								activeSelection.key === 'color_'
									? tastingSrc[activeSelection.activeOption]
									: tastingSrc[
											multiStepForm.tastingType === 'scholar4m' ||
											multiStepForm.tastingType === 'scholar3m' ||
											multiStepForm.tastingType === 'scholar2m'
												? this.getNextItems[multiStepForm.tastingType][activeSelection.key]
												: getNextItem[activeSelection.key]
									  ],
						},
					],
					activeSelection: {
						activeOption: null,
						isActive: false,
						key:
							multiStepForm.tastingType === 'scholar4m' ||
							multiStepForm.tastingType === 'scholar3m' ||
							multiStepForm.tastingType === 'scholar2m'
								? this.getNextItems[multiStepForm.tastingType][activeSelection.key]
								: getNextItem[activeSelection.key],
						options:
							activeSelection.key === 'color_'
								? tastingSrc[activeSelection.activeOption]
								: tastingSrc[
										multiStepForm.tastingType === 'scholar4m' ||
										multiStepForm.tastingType === 'scholar3m' ||
										multiStepForm.tastingType === 'scholar2m'
											? this.getNextItems[multiStepForm.tastingType][activeSelection.key]
											: getNextItem[activeSelection.key]
								  ],
					},
				},
				this.props.isSubStep,
				this.props.multiStepForm.tastingType === 'scholar4m'
					? getNextStepScholar4[this.props.name]
					: getNextStep[this.props.name]
			);
		}
	}

	render() {
		const {multiple, multiStepForm} = this.props;
		const {selections = [], activeSelection} = this.props.data;
		const hasSelections = selections.length - 1 > -1;

		const isActiveSelectionLast = hasSelections
			? selections[selections.length - 1].key === activeSelection && activeSelection.key
			: null;

		const showArrow = selections.length === 1 ? false : isActiveSelectionLast;

		let content = 'no data available';

		if (selections && selections.length > 0) {
			content = (
				<div>
					<Grid columns={6}>
						<ListSelectionOptions
							multiStepForm={multiStepForm}
							multiple={multiple}
							activeSelection={activeSelection}
							isLastSelection={showArrow}
							handleOptionSelect={this.handleOptionSelect}
							getIsChecked={this.getIsChecked}
						/>
					</Grid>
				</div>
			);
		}

		return (
			<div className="radio-list-selection">
				{content}
				{this.renderOtherInput()}
			</div>
		);
	}

	renderOtherInput() {
		const {displayInputOther, otherDescriptors} = this.state;

		if (!displayInputOther) {
			return null;
		}

		return (
			<DialogBox
				title="Other"
				description={
					<>
						<p>Please enter other descriptors.</p>
						<TextInput value={otherDescriptors} onChange={this.setOtherDescriptors} />
					</>
				}
				yesText="app_save"
				yesCallback={this.storeOtherDescriptors}
				noCallback={this.setInputOtherClosed}
				hideCloseButton
			/>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		multiStepForm: state.multiStepForm,
	};
}

export default connect(mapStateToProps, {
	updateSelectedItem,
	updateStepSelections,
	removeSelectedItem,
})(ListSelection);
