import React, {Component} from 'react';
import {connect} from 'react-redux';

import Modal from 'components/shared/ui/Modal';
import Grid from 'components/shared/ui/Grid';
import quick from 'assets/json/tasting/quick/quick.json';
import {updateSelectedItem} from 'actions/multiStepFormActions';
import SlidingSingleSelector from 'components/shared/ui/SlidingSingleSelector';

import './SliderStep.scss';

class SliderStep extends Component {
	handleOptionSelect = (value, name) => {
		if (name && value) {
			this.props.updateSelectedItem('characteristics', {[name]: value.id});
		}
	};

	render() {
		const {
			multiStepForm: {selectedItems},
			data = {},
		} = this.props;
		const {breadcrumb, subtitle} = this.props.data;
		const selectedCharacteristics = selectedItems && selectedItems.characteristics;

		return (
			<>
				<Modal.Breadcrumb path={breadcrumb} />
				<Modal.SubTitle text={subtitle} />
				<Grid columns={6}>
					<div>
						{data.keys &&
							data.keys.map((item) => {
								const values = quick[item];
								const options = values.map((value) => ({
									id: value,
									description: value,
								}));
								const selectedOption = selectedCharacteristics &&
									selectedCharacteristics[item] && {
										id: selectedCharacteristics[item],
										description: selectedCharacteristics[item],
									};

								return (
									<div className="SliderStep__Item" key={item}>
										<SlidingSingleSelector
											options={options}
											title={item}
											selectedOption={selectedOption}
											onChange={this.handleOptionSelect}
										/>
									</div>
								);
							})}
					</div>
				</Grid>
			</>
		);
	}
}

function mapStateToProps(state) {
	const {multiStepForm} = state;

	return {
		multiStepForm,
	};
}

export default connect(mapStateToProps, {updateSelectedItem})(SliderStep);
