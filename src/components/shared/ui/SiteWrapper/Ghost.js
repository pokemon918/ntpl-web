import React from 'react';
import shortid from 'shortid';
import {connect} from 'react-redux';
import bugsnagClient from 'config/bugsnag';

import DialogBox from 'components/shared/ui/DialogBox';
import {createEmailMessage, getLocalState} from 'commons/commons';

const GhostVersion = ({userData, isAuthenticated}) => {
	const [displayExportModal, setDisplayExportModal] = React.useState(false);

	let title = '';

	let buildInfo = [
		'__TAGS__',
		'__BUILD__' ? 'b__BUILD__' : '',
		'__BRANCH__',
		'__COMMIT__',
		'__DATETIME__',
	];

	if (/ntbl\.link$/.test(window.location.origin)) {
		let info = buildInfo;
		if ('__BUILD__'.length) {
			info = ['b__BUILD__'];
		}
		title = info.filter(Boolean).join(' · ');
	}

	if (/localhost/.test(window.location.origin)) {
		title = 'Local development';
	}

	const toggleExportLocalState = () => setDisplayExportModal(!displayExportModal);

	const sendReportWithExport = () => {
		const {json} = getLocalState();
		const userRef = isAuthenticated ? userData.ref.toUpperCase() : '0x00';
		const userName = userData && userData.name ? userData.name : '';
		const logRef = shortid.generate().toUpperCase().slice(-4);
		const logMessage = `[${userRef}-${logRef}] Problem found on ${window.location.hostname}`;
		bugsnagClient.notify(logMessage, {
			metadata: {
				localState: json,
			},
		});
		createEmailMessage(
			logMessage,
			`Hi team,\n\nI encountered a problem when using ${window.location.origin}.\n\nHere is a brief explanation of what happend:\n\n\n\n\n\nKind regards \n${userName}`
		);
		setDisplayExportModal(false);
	};

	if (displayExportModal) {
		return (
			<DialogBox
				title="feedback_bugsnag_title"
				description="feedback_bugsnag_message"
				yesCallback={sendReportWithExport}
				noCallback={toggleExportLocalState}
			/>
		);
	}

	return (
		<div id="ghost" onClick={toggleExportLocalState} title={buildInfo.filter(Boolean).join(' · ')}>
			{title}
		</div>
	);
};

function mapStateToProps(state) {
	return {
		userData: state.user.userData,
		isAuthenticated: state.user.isLoggedIn,
	};
}

export default connect(mapStateToProps)(GhostVersion);
