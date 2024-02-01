import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/shared/ui/Button';
import './TrialStatusModal.scss';

class TrialStatusModal extends React.Component {
	render() {
		const {daysLeft, onContinue, onClose} = this.props;

		return (
			<div className="TrialStatusModal__Root">
				<div className="TrialStatusModal__Wrapper">
					<div className="TrialStatusModal__Container__Header">
						You have {daysLeft} days left of your free trial
					</div>
					<div className="TrialStatusModal__Container__CloseButton" title="Close" onClick={onClose}>
						&times;
					</div>
					<div className="TrialStatusModal__Container__Body">
						<div className="TrialStatusModal__Container__BodyContent">
							<div>
								<p>
									Enter your credit card information to make sure we save your tastings after the
									trial ends.
								</p>
							</div>
						</div>
					</div>

					<div className="TrialStatusModal__Container__FooterWrapper">
						<div className="TrialStatusModal__Container__FooterContainer">
							<Button onHandleClick={onContinue}>Enter credit card details now</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

TrialStatusModal.propTypes = {
	daysLeft: PropTypes.number.isRequired,
	onContinue: PropTypes.func,
	onClose: PropTypes.func,
};

export default TrialStatusModal;
