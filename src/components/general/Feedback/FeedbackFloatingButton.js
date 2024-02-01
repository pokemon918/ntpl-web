import React, {Component} from 'react';
import {IoIosBulb} from 'react-icons/io';

export default class FeedbackFloatingButton extends Component {
	render() {
		return (
			<div className="feedback-floating-btn">
				<button className="btn btn-primary" onClick={this.props.handleClick}>
					<IoIosBulb className="arrow-icon" />
				</button>
			</div>
		);
	}
}
