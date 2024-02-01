import React, {Component} from 'react';

import './ErrorBoundaryFallback.scss';
import bugsnagClient from 'config/bugsnag';
import {routeConstants} from 'const';
import Grid from 'components/shared/ui/Grid';

export default class ErrorBoundary extends Component {
	componentDidMount() {
		bugsnagClient.notify(new Error(`Page is navigated to error page.`));
	}

	reset = () => {
		localStorage.clear();
		window.location.href = routeConstants.APP_RESET;
	};

	get errorPage() {
		return (
			<Grid columns={6}>
				<div className="error-boundary-page">
					<h4 className="header-error-boundary">Something went wrong</h4>
					<div className="message">
						<p>
							An error on our side obstructed your action. We are very sorry about this. The
							incident has been reported to our technical team and we will do everything we can to
							make sure you dont experience this ever again.
						</p>
						<p>To make sure no data gets damaged you have been logged out.</p>

						<p>
							Please click{' '}
							<b onClick={this.reset} className="link">
								here
							</b>{' '}
							to login again.
						</p>
					</div>
				</div>
			</Grid>
		);
	}

	render() {
		return this.errorPage;
	}
}
