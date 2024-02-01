import React, {Component} from 'react';
import {connect} from 'react-redux';

import Spinner from 'components/shared/ui/Spinner';
import {contestInfoIsLoadingSelector} from 'reducers/contestsReducer/contestInfoReducer';

import Back from './Back';
import '../contest.scss';

class NotFound extends Component {
	render() {
		const {isLoading} = this.props;

		if (isLoading) {
			return <Spinner />;
		}

		return (
			<>
				<Back />
				<div>No contest available at the moment.</div>
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		isLoading: contestInfoIsLoadingSelector(state),
	};
}

export default connect(mapStateToProps, null)(NotFound);
