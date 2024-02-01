import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import '../contest.scss';

class Back extends Component {
	onBack = (e) => {
		//this.props.history.goBack();
		e.persist();
		e.nativeEvent.stopImmediatePropagation();
		e.stopPropagation();

		let dirs = (this.props.history.location.pathname + '/').split('/').filter(Boolean);
		dirs.pop();
		dirs.pop();
		this.props.history.push('/' + dirs.join('/'));
	};
	render() {
		return (
			<div className="Contest_Back">
				<a href="#" onClick={this.onBack}>
					&lt; Back
				</a>
			</div>
		);
	}
}

export default withRouter(Back);
