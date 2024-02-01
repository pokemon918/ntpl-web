import React, {Component} from 'react';
import {connect} from 'react-redux';

import {sendFeedback} from 'actions/feedbackActions';
import FeedbackFloatingButton from './FeedbackFloatingButton';
import FeedbackForm from './FeedbackForm';

// styles
import './Feedback.scss';
import L18nText from 'components/shared/L18nText';

class Feedback extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showForm: false,
		};
		this.sendFeedback = this.sendFeedback.bind(this);
		this.toggleFeedbackForm = this.toggleFeedbackForm.bind(this);
	}

	sendFeedback(feedback, callback) {
		this.props.sendFeedback(feedback, callback);
	}

	toggleFeedbackForm() {
		this.setState({
			showForm: !this.state.showForm,
		});
	}

	render() {
		return (
			<div className={'feedback-wrapper ' + (!this.state.showForm ? 'fhidden' : '')}>
				<div className="feedback">
					<FeedbackFloatingButton handleClick={this.toggleFeedbackForm} />
					<div className="feedback-form-container">
						<h4>
							<L18nText id="feedback_title" defaultMessage="Please send us your feedback." />
						</h4>
						<FeedbackForm
							feedback={this.props.feedback}
							submitCallback={this.sendFeedback}
							toggleFeedbackForm={this.toggleFeedbackForm}
						/>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		feedback: state.feedback,
	};
}

export default connect(mapStateToProps, {sendFeedback})(Feedback);
