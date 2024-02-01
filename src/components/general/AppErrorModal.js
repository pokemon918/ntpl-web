import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {closeModal} from 'actions/appErrorModalActions';
import {logoutUser} from 'actions/userActions';
import {clearServerError} from 'actions/appActions';
import L18nText from 'components/shared/L18nText';
import DialogBox from 'components/shared/ui/DialogBox';
import {routeConstants} from 'const';

class AppErrorModal extends Component {
	close = () => {
		this.props.clearServerError();
		if (this.props.errorCount === 4) {
			window.location.href = routeConstants.APP_RESET;
		}
		this.props.closeModal();
	};

	onRedirectToLogin = () => {
		this.props.clearServerError();
		window.location.href = routeConstants.APP_RESET;
	};

	getAdditionalData = () => {
		const {
			appErrorModal: {additionalData},
		} = this.props;

		if (additionalData && additionalData.field) {
			return {
				...additionalData,
				field: <L18nText id={additionalData.field} />,
			};
		}

		return {};
	};

	render() {
		const {
			appErrorModal: {mustLoginAgain},
		} = this.props;

		return (
			<div className="App__Error">
				{this.props.appErrorModal.isOpen && mustLoginAgain && (
					<DialogBox
						title={this.props.appErrorModal.title || 'Error Found'}
						description={'error_login_again_desc'}
						yesText="error_try_again"
						noText="error_login_again"
						additionalData={this.getAdditionalData()}
						noCallback={this.onRedirectToLogin}
						yesCallback={this.close}
					/>
				)}

				{this.props.appErrorModal.isOpen && !mustLoginAgain && (
					<DialogBox
						title={this.props.appErrorModal.title || 'Error Found'}
						description={this.props.appErrorModal.message}
						errorBox
						additionalData={this.getAdditionalData()}
						errorButtonText={'app_close'}
						noCallback={this.close}
						yesCallback={this.close}
					/>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		appErrorModal: state.appErrorModal,
		serverError: state.appErrorModal.serverError,
		errorCount: state.appErrorModal.serverErrorCount,
		mustLoginAgain: state.appErrorModal.mustLoginAgain,
	};
}

export default connect(mapStateToProps, {clearServerError, closeModal, logoutUser})(
	withRouter(AppErrorModal)
);
