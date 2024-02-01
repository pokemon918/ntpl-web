import React, {Component} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';

import {updateSelectedItem} from 'actions/multiStepFormActions';
import Grid from 'components/shared/ui/Grid';
import Modal from 'components/shared/ui/Modal';
import SingleSelector from 'components/shared/ui/SingleSelector';

import medals from 'assets/json/tasting/medal.json';
import recommendations from 'assets/json/tasting/medal_recommendation.json';

import './MedalStep.scss';

const getMedalId = (medalString) => medalString.replace(/^tasting_/, '');

const MEDAL_COLORS = {
	tasting_medal_gold: '#b69b5e',
	tasting_medal_silver: '#b2b2b2',
	tasting_medal_bronze: '#bc8e6d',
	tasting_medal_extra_trophies: 'transparent',
};

class MedalStep extends Component {
	updateSelectedMedal = (medal) => {
		this.props.updateSelectedItem('medal', {selectedMedal: getMedalId(medal.id)});
	};

	getMedalSelections() {
		const {isMedal} = this.props;
		const activeMedals = isMedal ? medals : recommendations;
		return activeMedals.keys.map((key) => ({id: key, name: key}));
	}

	getSelectedMedal = () => {
		const currentMedal = get(this.props.multiStepForm.selectedItems, 'medal.selectedMedal');
		return this.getMedalSelections().find((medal) => getMedalId(medal.id) === currentMedal);
	};

	render() {
		const {isMedal} = this.props;
		const title = isMedal ? 'tasting_medal' : 'tasting_recommendation';

		return (
			<>
				<Modal.Breadcrumb path={`tasting_observations / ${title}`} />
				<Modal.Title text={title} />
				<Modal.SubTitle text={isMedal ? 'tasting_what_medal' : 'shared_empty'} />
				<Grid columns={6}>
					<div>
						<SingleSelector
							type={isMedal ? 'color' : 'default'}
							colors={MEDAL_COLORS}
							items={this.getMedalSelections()}
							selected={this.getSelectedMedal()}
							onSelect={this.updateSelectedMedal}
						/>
					</div>
				</Grid>
			</>
		);
	}
}

const mapStateToProps = ({multiStepForm}) => ({
	multiStepForm,
});

export default connect(mapStateToProps, {updateSelectedItem})(MedalStep);
