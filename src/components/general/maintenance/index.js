import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import storage from 'redux-persist/lib/storage';
import {exportBackup, initiateLogin} from 'ntbl_client/ntbl_api';

import './Maintenance.scss';
import L18nText from 'components/shared/L18nText';
import {connect} from 'react-redux';
import appConfig from 'config/app';
import {_retryGet, _retryPost, clearCache} from 'commons/commons';
import {clearServerError} from 'actions/appActions';
import bugsnagClient from 'config/bugsnag';

class Maintenance extends Component {
	constructor(props) {
		super(props);
		this.timer = '';
	}

	componentDidMount() {
		bugsnagClient.notify(new Error(`Page is navigated to maintence page.`));

		const {path, path2, url, options, data, isChangePassword} = this.props.error;

		this.timer = setInterval(async () => {
			if (path) {
				try {
					if (isChangePassword) {
						await _retryPost(path, data);
						let specsResponse;
						clearCache();
						[specsResponse] = await _retryGet(path2);
						clearInterval(this.timer);

						let specs = specsResponse.data;
						let userSpecs = {
							email: data.email,
							ref: specs.ref,
							salt: specs.salt,
							iterations: specs.iterations,
						};

						initiateLogin(data.password, userSpecs.ref, userSpecs.salt, userSpecs.iterations);
						storage.setItem('mem', exportBackup());

						this.props.history.replace(url);
					}
					if (!isChangePassword && options && options.method === 'GET') {
						await _retryGet(path);
						clearInterval(this.timer);
						this.props.history.replace(url);
					}
					if (!isChangePassword && options && options.method === 'POST') {
						await _retryPost(path, data);
						clearInterval(this.timer);
						this.props.history.replace(url);
					}
				} catch (err) {}
			}
		}, appConfig.ERROR_TIME);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
		this.props.clearServerError();
	}

	render() {
		return (
			<div className="Maintenance__Container">
				<div className="Maintenance__Text">
					<h2 className="Title">
						<L18nText id="app_maintenance" defaultMessage="Maintenance underway" />
					</h2>
					<div className="Description">
						<L18nText
							id="app_maintenance_scheduled"
							defaultMessage="Noteable is down for scheduled maintenance."
						/>
					</div>
					<div className="Description">
						<L18nText id="app_maintenance_back" defaultMessage="We'll be back soon!" />
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		error: state.appErrorModal.error,
	};
}

export default connect(mapStateToProps, {clearServerError})(withRouter(Maintenance));
