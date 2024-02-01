import React, {Component} from 'react';
import {connect} from 'react-redux';
import ListSelector from './ListSelector';

class ListSelectors extends Component {
	render() {
		const {selections, handleSelectionSelect, multiple} = this.props;

		const selectors = selections.map((selection, index) => {
			// Setup classnames
			let classNames = ['col-sm', 'selection-button'];
			let selectedOption = null;

			if (selection.isActive) {
				classNames.push('is-active');
			}

			if (selection.hideSelection) {
				classNames.push('hidden');
			}

			if (selection.activeOption) {
				if (multiple) {
					selectedOption =
						selection.activeOption.length > 0
							? selection.activeOption.length + '/' + selection.options.length
							: null;
				} else {
					selectedOption = selection.activeOption;
				}
			}

			return (
				<ListSelector
					key={index}
					classNames={classNames.join(' ')}
					handleClick={() => handleSelectionSelect(selection.key)}
					selection={selection}
					selectedOption={selectedOption}
				/>
			);
		});

		return <div className="row selection-buttons">{selectors}</div>;
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		multiStepForm: state.multiStepForm,
	};
}

export default connect(mapStateToProps)(ListSelectors);
