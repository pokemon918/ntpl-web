import React, {Component} from 'react';
import {connect} from 'react-redux';

import {InfoForm} from '../partials';
import Modal from 'components/shared/ui/Modal';
import {tastingTypesWithDetailedNotes} from './notes';

class InfoStep extends Component {
	render() {
		const {
			multiStepForm: {tastingType},
		} = this.props;
		let breadcrumb = '';
		breadcrumb = `tasting_info`;
		if (tastingTypesWithDetailedNotes.includes(tastingType)) {
			breadcrumb = `${tastingType}_ / tasting_info`;
		}

		return (
			<div className="step-container info-step">
				<Modal.Breadcrumb path={breadcrumb} />
				<Modal.Title text={'wine_details'} />
				<InfoForm initState={this.props.initState} />
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

export default connect(mapStateToProps)(InfoStep);
