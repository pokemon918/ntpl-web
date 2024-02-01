import {connect} from 'react-redux';
import React, {Component} from 'react';
import {updateSelectedItem} from 'actions/multiStepFormActions';
import BinarySelection from 'components/shared/ui/BinarySelection';
import Grid from 'components/shared/ui/Grid';
import L18nText from 'components/shared/L18nText';

class BinarySelectionStep extends Component {
	handleChange = (value, item) => {
		this.props.updateSelectedItem('mineralAndHerbal', {
			[item.keys[0]]: value,
		});
	};

	render() {
		const selectedItem = this.props.multiStepForm.selectedItems.mineralAndHerbal;

		return this.props.data.map((item, index) => {
			const isSelected = selectedItem && selectedItem[item.keys[0]];

			return (
				<Grid columns={6}>
					<div className="binary-selection-wrapper" key={index}>
						{index !== 0 && (
							<div className="binary-selection-title">
								<L18nText id={item.keys[0]} defaultMessage={item.keys[0]} />
							</div>
						)}
						<BinarySelection selected={isSelected} onSelect={this.handleChange} item={item} />
					</div>
				</Grid>
			);
		});
	}
}

function mapStateToProps(state) {
	return {
		multiStepForm: state.multiStepForm,
	};
}

export default connect(mapStateToProps, {updateSelectedItem})(BinarySelectionStep);
