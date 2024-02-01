import React, {Component} from 'react';
import {connect} from 'react-redux';
import BoxSelectionOption from './BoxSelectionOption';
import L18nText from 'components/shared/L18nText';

class BoxSelection extends Component {
	render() {
		const {selection, additionalClasses} = this.props;
		let classes = ['container', 'box-selection'].concat(additionalClasses);

		let options = selection.options.map((option, index) => {
			return (
				<BoxSelectionOption
					key={index}
					option={option}
					selectionKey={selection.key}
					selectionName={selection.selectionName}
					isChecked={option === selection.activeOption}
					nuance={selection.nuance_tint_}
					clarity={selection.clarity__}
					handleOptionSelect={this.props.handleOptionSelect}
				/>
			);
		});

		return (
			<div className={classes.join(' ')}>
				<h2 className="box-selection-title">
					<L18nText id={selection.key} defaultMessage={selection.key} />
				</h2>
				<div className="row">{options}</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
	};
}

export default connect(mapStateToProps)(BoxSelection);
