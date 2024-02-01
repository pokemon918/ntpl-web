import React, {Component} from 'react';
import {connect} from 'react-redux';
import BoxSelection from './BoxSelection';
import L18nText from 'components/shared/L18nText';
import updateBoxSelections from 'commons/updateBoxSelections';
import {updateStepSelections} from 'actions/multiStepFormActions';
import appearance from 'assets/json/tasting/profound/appearance.json';
import appearanceScholar2 from 'assets/json/tasting/scholar2/appearance.json';
import appearanceScholar3 from 'assets/json/tasting/scholar3/appearance.json';
import appearanceScholar4 from 'assets/json/tasting/scholar4/appearance.json';

// styles
import './BoxSelectionGroup.scss';
import Grid from 'components/shared/ui/Grid';

const appearanceData = {
	profound: appearance,
	scholar2: appearanceScholar2,
	scholar2m: appearanceScholar2,
	scholar3: appearanceScholar3,
	scholar3m: appearanceScholar3,
	scholar4: appearanceScholar4,
	scholar4m: appearanceScholar4,
};

class BoxSelectionGroup extends Component {
	constructor(props) {
		super(props);
		this.handleOptionSelect = this.handleOptionSelect.bind(this);
	}
	state = {
		selectedSelected: '',
	};

	getNextValue = () => {
		const {tastingType} = this.props.multiStepForm;

		const result =
			appearanceData[tastingType] &&
			appearanceData[tastingType].keys.indexOf(this.state.selectedSelected);

		return appearanceData[tastingType].keys[result + 1];
	};

	handleOptionSelect(event, selectionKey) {
		const {multiStepForm} = this.props;
		const {tastingType} = this.props.multiStepForm;
		const {selections, activeSelection} = this.props.data;
		const target = event.target;
		const value = target.value;
		let tastingSrc = multiStepForm.tastingSrc;

		let newActiveSelection = null;
		let newSelections = [];
		activeSelection.isActive = false; // set the previous active selection to false

		this.setState({selectedSelection: activeSelection.key});
		// set active selection
		selections.forEach((selection, index) => {
			let tempSelection = Object.assign({}, selection);
			newSelections.push(tempSelection);

			if (tempSelection.key === selectionKey) {
				this.setState({selectedSelected: tempSelection.key});
				tempSelection.isActive = true;
				tempSelection.activeOption = value;
				newActiveSelection = tempSelection;
			}
		});

		if (this.props.customAction && selectionKey === 'colorintensity__') {
			this.props.customAction();
		}

		updateBoxSelections(tastingType, tastingSrc, selectionKey, newSelections, newActiveSelection);

		this.props.updateStepSelections(this.props.step, {
			selections: newSelections,
			activeSelection: newActiveSelection,
		});
	}

	componentDidUpdate() {
		this.getNextValue() &&
			this[this.getNextValue()].scrollIntoView(true, {
				behavior: 'smooth',
			});
	}

	get boxSelections() {
		const {data: {selections, activeSelection} = {}} = this.props;

		if (!selections || !selections.length) {
			return <L18nText id={'error_data_unavailable'} defaultMessage={'No data available'} />;
		}

		return selections.map((selection, index) => {
			let selectionClasses = [];

			if (selection.hideSelection) {
				selectionClasses.push('hidden');
			}
			return (
				<div key={index} ref={(node) => (this[selection.key] = node)}>
					<BoxSelection
						selection={selection}
						activeSelection={activeSelection}
						handleOptionSelect={this.handleOptionSelect}
						additionalClasses={selectionClasses}
					/>
				</div>
			);
		});
	}

	render() {
		return (
			<Grid columns={6}>
				<div>
					<div className="box-selection-wrapper">{this.boxSelections}</div>
					<div
						className="scroll-end-point"
						ref={(el) => {
							this.scrollEndPoint = el;
						}}
					/>
				</div>
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		multiStepForm: state.multiStepForm,
	};
}

export default connect(mapStateToProps, {updateStepSelections})(BoxSelectionGroup);
