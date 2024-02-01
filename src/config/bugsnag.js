import bugsnag from '@bugsnag/browser';

import {
	getScreenDimensions,
	getScreenOrientation,
	isTouchScreen,
	getLocalState,
	isLocalhost,
} from 'commons/commons';

const MANUAL_BUGSNAG_REPORT_REGEX = /(^\[\S+] )/;

const preventReportingOnDev = (report) => {
	//const hostname = window.location.hostname;

	// manual bugsnag reports should be logged regardless of environment
	if (MANUAL_BUGSNAG_REPORT_REGEX.test(report.errorMessage)) {
		return;
	}

	if (isLocalhost()) {
		report.ignore();
	}
};

export const getReleaseStage = (host = window.location.host) => {
	if (/noteable\.co[:\d]*$/i.test(host)) return 'PROD';

	if (/^test\.ntbl\.link[:\d]*$/i.test(host)) return 'TEST';

	if (/ci-test\.ntbl\.link[:\d]*$/i.test(host)) return 'CI';

	if (/\.ntbl\.link[:\d]*$/i.test(host)) return 'DEV';

	if (isLocalhost(host)) return 'LOCAL';

	return 'OTHER';
};

const bugsnagClient = bugsnag({
	apiKey: '6ac91926d24d2a97b6e4d54d1cba9119',
	appVersion: '__VERSION__',
	releaseStage: getReleaseStage(),
	//autoBreadcrumbs: false,
	beforeSend: (report) => {
		preventReportingOnDev(report);

		//if (getReleaseStage() !== 'production') {
		const state = getLocalState();
		const metaData = {
			...report.metadata,
			error: report.metadata?.error?.message ?? report.metadata?.error,
		};
		report.metaData = {
			datetime: '__DATETIME__',
			tags: '__TAGS__',
			build: '__BUILD__',
			version: '__VERSION__',
			commit: '__COMMIT__',
			branch: '__BRANCH__',
			...metaData,
			localState: state ? state.json : null,
		};
		//}
	},
});

function updateDeviceInformation() {
	bugsnagClient.device = {
		...bugsnagClient.device,
		dimensions: getScreenDimensions(),
		orientation: getScreenOrientation(),
		hasTouch: isTouchScreen(),
	};
}
updateDeviceInformation();
window.addEventListener('resize', updateDeviceInformation);

function updateUserInformation() {
	try {
		const userData = JSON.parse(localStorage.getItem('mem'));
		bugsnagClient.user = {
			state: 'logged-in',
			id: userData.userRef,
		};
	} catch (ex) {
		bugsnagClient.user = {
			state: 'logged-out',
			id: null,
		};
	}
}
updateUserInformation();
window.addEventListener('storage', updateUserInformation);

bugsnagClient.metadata = {
	deployment: {
		branch: '__BRANCH__',
		commit: '__COMMIT__',
	},
};

export default bugsnagClient;
