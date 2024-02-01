import React, {Component} from 'react';

import L18nText from 'components/shared/L18nText';
import './PrivateModeError.scss';

export default class PrivateModeError extends Component {
	render() {
		return (
			<div className="private-mode-error-page container">
				<div className="content">
					<h2 className="header-error">
						<L18nText id="error_browser_not_supported" defaultMessage="Browser Not Supported" />
					</h2>
					<div className="message">
						<p>
							<L18nText
								id="error_private_mode_not_supported"
								defaultMessage="It looks like your are surfing in private mode. The technology we are using needs to store data locally so you will not be able to use NoteAble."
							/>
						</p>
						<p>
							<L18nText
								id="error_please_try_another_browser"
								defaultMessage="Please try another browser."
							/>
						</p>
					</div>
				</div>
			</div>
		);
	}
}
