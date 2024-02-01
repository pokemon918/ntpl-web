import React, {Component} from 'react';
import {connect} from 'react-redux';
import L18nText from 'components/shared/L18nText';

class ListSelector extends Component {
	render() {
		const {selection, selectedOption, classNames, handleClick} = this.props;

		return (
			<div className={classNames} onClick={() => handleClick(selection.key)}>
				<div className="selected-selection">
					<p>
						<L18nText id={selection.key} defaultMessage={selection.key} />
					</p>
					{selectedOption && (
						<p className={'selected-option ' + (selectedOption ? 'has-option' : '')}>
							<L18nText id={selectedOption} defaultMessage={selectedOption} />
						</p>
					)}
				</div>
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

export default connect(mapStateToProps)(ListSelector);
