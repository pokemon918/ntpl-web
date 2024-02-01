import React from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import shortid from 'shortid';
import classNames from 'classnames';

import noteableLogo from 'assets/images/noteable_logo.svg';
import {
	createEmailMessage,
	getLocalState,
	isProductionSite,
	handleSingleDoubleClick,
} from 'commons/commons';
import bugsnagClient from 'config/bugsnag';
import routeConstants from 'const/route.constants';

import DialogBox from '../DialogBox';
import HamburgerMenu from './HamburgerMenu';
import {ReactComponent as IconProfile} from './Icon_Profile.svg';
import './SiteHeader.scss';
import {truncate} from 'commons/commons';

export const SiteHeader = ({
	onMenuClick,
	isOnlyHamburgerView,
	mustLoginAgain = false,
	isAuthenticated = false,
	subscription = null,
	userData = null,
	location = {},
	history = {},
}) => {
	const [displayExportModal, setDisplayExportModal] = React.useState(false);

	const goToLandingPage = () => {
		history.replace(routeConstants.MY_TASTINGS);
	};

	const updateToggleExportLocalState = () => {
		if (!isProductionSite()) {
			toggleExportLocalState();
		}
	};

	// makes the single click work faster in production
	// because we don't use the double click handler in production anyway
	const getLogoClickHandler = () => {
		if (!isProductionSite()) {
			return handleSingleDoubleClick(goToLandingPage, updateToggleExportLocalState);
		}
		return goToLandingPage;
	};

	if (isOnlyHamburgerView) {
		return (
			<div className="SiteHeader_Wrapper">
				<HamburgerMenu onMenuClick={onMenuClick} />
			</div>
		);
	}

	const hideMenu = ![routeConstants.BILLING, routeConstants.SUBSCRIPTION].includes(
		location.pathname
	);

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
			`Hi team,\n\nI encountered a problem when using Noteable. \n\nHere is a brief explanation of what I was doing:\n\n\n\n\n\nKind regards, \n${userName}`
		);
		setDisplayExportModal(false);
	};

	const displayNavBarLinks = !subscription || !subscription.skipSelectPlan;

	return (
		<div className={classNames('SiteHeader_Wrapper', 'all', {authenticated: isAuthenticated})}>
			<div className="SiteHeader_Logo" onClick={getLogoClickHandler()}>
				<img
					src={noteableLogo}
					title="Noteable logo __COMMIT__ __BRANCH__ __BUILD__"
					alt="commit"
				/>
			</div>
			{hideMenu && (
				<div className="SiteHeader_Navigation">
					{displayNavBarLinks && (
						<>
							<div className="SiteHeader_NavigationUser">
								{isAuthenticated && (
									<div className="SiteHeader_UserInfo">
										<div className="SiteHeader_UserInfo_Icon">
											<Link to="/profile">
												<IconProfile />
											</Link>
										</div>
										{!mustLoginAgain && (
											<Link to="/profile">
												<span>{userData && truncate(userData.name)}</span>
											</Link>
										)}
									</div>
								)}
							</div>
							{isAuthenticated && <HamburgerMenu onMenuClick={onMenuClick} />}
						</>
					)}
				</div>
			)}
			{displayExportModal && (
				<DialogBox
					title="feedback_bugsnag_title"
					description="feedback_bugsnag_message"
					yesCallback={sendReportWithExport}
					noCallback={toggleExportLocalState}
				/>
			)}
		</div>
	);
};

SiteHeader.propTypes = {
	onMenuClick: PropTypes.func,
	isOnlyHamburgerView: PropTypes.bool,
};

export default withRouter(SiteHeader);
