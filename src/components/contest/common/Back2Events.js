import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import '../contest.scss';

class Back extends Component {
	onBack = (e) => {
		e.persist();
		e.nativeEvent.stopImmediatePropagation();
		e.stopPropagation();
		this.props.history.push('/events');
	};
	render() {
		return (
			<div className="Contest_Back">
				<div className="link-mouse" onClick={this.onBack}>
					&lt; Back
				</div>
			</div>
		);
	}
}

export default withRouter(Back);
