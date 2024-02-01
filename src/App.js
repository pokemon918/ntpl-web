import 'intl-polyfill';
import {parse} from 'query-string';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Switch, Redirect, Route, Link, withRouter} from 'react-router-dom';
import classNames from 'classnames';

import bugsnagClient from 'config/bugsnag';
import {isTouchScreen} from 'commons/commons';
import bugsnagReact from '@bugsnag/plugin-react';
import 'commons/intl-polyfill';

import {saveAdvancedOptions} from 'actions/appActions';
import IntlProvider from 'components/shared/IntlProvider';
import SiteWrapper from 'components/shared/ui/SiteWrapper';
import L18nText from 'components/shared/L18nText';
import Button from 'components/shared/ui/Button';
import GhostVersion from 'components/shared/ui/SiteWrapper/Ghost';

import {
	Logout,
	Landing,
	NotFound,
	Maintenance,
	PrivateRoute,
	AppErrorModal,
	PrivateModeError,
	ErrorBoundaryFallback,
	ThankYou,
} from 'components/general';

import ContestArrival from 'components/contest/ContestArrival';
import ContestCategory from 'components/contest/progress';
import ContestAssessmentFinal from 'components/contest/AssessmentFinal';
import ContestResults from 'components/contest/Results';
import ContestTrophy from 'components/contest/Trophy';
import ContestAssessmentTeam from 'components/contest/AssessmentTeam';
import ContestDistribution from 'components/contest/Distribution';
import ContestDashboard from 'components/contest';
import ContestTeamList from 'components/contest/Team';
import ContestTeamDashboard from 'components/contest/teamLead/';
import Billing from 'components/billing';
import SignUp from 'components/auth/sign-up';
import SignIn from 'components/auth/sign-in';
import Reset from 'components/auth/reset';
import {AutoSuggestDemo, SearchDemo} from 'components/demo';
import ConnectedSiteMenu from 'components/general/ConnectedSiteMenu';
import SubscriptionPage from 'components/subscription';
import SubscriptionUpdated from 'components/subscription/SubscriptionUpdated';
import PriceCompare from 'components/subscription/price-compare';
import SetPassword from 'components/auth/setPassword';
import {MyWines, WineDetails} from 'components/my-wines';
import SubscriptionForm from 'components/chargify';
import PaymentProfileForm from 'components/chargify/ProfilePage';
import WineList from 'components/wineList/WineList';
import {NewTasting, SelectTasting} from 'components/tasting';
import {FindTeams, TeamDetails, MyTeams} from 'components/my-teams';
import {
	EventList,
	EventSummary,
	EventTasting,
	EventTastingList,
	MyEvents,
	CreateEvent,
	SelectEventTasting,
	RedirectEventTasting,
} from 'components/events';
import NewEvent from 'components/events/NewEvent';

import appConfig from './config/app';
import {routeConstants} from 'const';
import ProfilePage from 'components/profile';
import DevelopmentSettings from 'components/profile/dev';
import './main.scss';
import './App.scss';

function isBlankWrapper(currentRoute) {
	const NO_SITE_WRAPPER_PAGES = [routeConstants.PRICE_COMPARE];
	return NO_SITE_WRAPPER_PAGES.includes(currentRoute);
}

function getSiteWrapper(currentRoute) {
	if (isBlankWrapper(currentRoute)) {
		const BlankWrapper = ({children}) => <div>{children}</div>;
		return BlankWrapper;
	}
	return SiteWrapper;
}

const AppRoutes = () => (
	<Switch>
		{/* Home route */}
		<Route path={routeConstants.HOME} exact component={Landing} />
		{/* Sign up and sign in process */}
		<Route path={routeConstants.SIGN_UP} exact component={SignUp} />
		<Redirect from={routeConstants.SIGNUP} to={routeConstants.SIGN_UP} />;
		<Route path={routeConstants.SIGN_IN} exact component={SignIn} />
		<Redirect from={routeConstants.SIGNIN} to={routeConstants.SIGN_IN} />
		<Redirect from={routeConstants.LOG_IN} to={routeConstants.SIGN_IN} />
		<Redirect from={routeConstants.LOGIN} to={routeConstants.SIGN_IN} />
		<Route path={routeConstants.LOGOUT} exact component={Logout} />
		<PrivateRoute path={routeConstants.CONTEST} exact component={ContestDashboard} />
		<PrivateRoute
			path={routeConstants.CONTEST_ASSESSMENT}
			exact
			component={ContestAssessmentFinal}
		/>
		<PrivateRoute path={routeConstants.CONTEST_RESULT} exact component={ContestResults} />
		<PrivateRoute path={routeConstants.CONTEST_TROPHY} exact component={ContestTrophy} />
		<PrivateRoute
			path={routeConstants.CONTEST_TEAM_STATEMENT}
			exact
			component={ContestAssessmentTeam}
		/>
		<PrivateRoute path={routeConstants.CONTEST_ARRIVAL} exact component={ContestArrival} />
		<PrivateRoute path={routeConstants.CONTEST_PROGRESS} exact component={ContestCategory} />
		<PrivateRoute
			path={routeConstants.CONTEST_DISTRIBUTION}
			exact
			component={ContestDistribution}
		/>
		<PrivateRoute path={routeConstants.CONTEST_TEAM} exact component={ContestTeamList} />
		<PrivateRoute
			path={routeConstants.CONTEST_TEAM_DASHBOARD}
			exact
			component={ContestTeamDashboard}
		/>
		<Redirect from={routeConstants.CONTEST_PAGE} to={routeConstants.EVENTS} />
		<Redirect from={routeConstants.LOG_OUT} to={routeConstants.LOGOUT} />;
		<Route path={routeConstants.RESET_PASSWORD} exact component={Reset} />
		<Route path={routeConstants.RESET_TOKEN} exact component={SetPassword} />
		{/* User profile */}
		<PrivateRoute exact path={routeConstants.PROFILE} component={ProfilePage} />
		{/* Everything related to subscription */}
		<Route path={routeConstants.PRICE_COMPARE} exact component={PriceCompare} />
		<Route path={routeConstants.SUBSCRIPTION} exact component={SubscriptionPage} />
		<Route path={routeConstants.SUBSCRIPTION_UPDATED} exact component={SubscriptionUpdated} />
		<Route path={routeConstants.BILLING} exact component={Billing} />
		{/* <Route path={routeConstants.PAYMENT} exact component={SubscriptionForm} /> */}
		<Route path={routeConstants.WELCOME_THANK_YOU} exact component={ThankYou} />
		{/* Tasting module */}
		<PrivateRoute path={routeConstants.MY_TASTINGS} exact component={MyWines} />
		<PrivateRoute path={routeConstants.TASTING_RESULT_REF} exact component={WineDetails} />
		<PrivateRoute path={routeConstants.NEW_TASTING_RESULT} exact component={WineDetails} />
		<PrivateRoute exact path={routeConstants.TASTING} component={SelectTasting} />
		<PrivateRoute path={routeConstants.NEW_TASTING_TYPE} exact component={NewTasting} />
		<PrivateRoute path={routeConstants.EDIT_TASTING} exact component={NewTasting} />
		<PrivateRoute path={routeConstants.NEW_EVENT_TASTING} exact component={SelectEventTasting} />
		<PrivateRoute
			path={routeConstants.NEW_PRODUCT_TASTING}
			exact
			component={RedirectEventTasting}
		/>
		{/* Events module */}
		<Redirect exact from={routeConstants.EVENT} to={routeConstants.EVENTS} />;
		<PrivateRoute path={routeConstants.EVENTS} exact component={EventList} />
		<PrivateRoute exact path={routeConstants.EVENT_NEW} component={CreateEvent} />
		<PrivateRoute path={routeConstants.MY_EVENTS} exact component={MyEvents} />
		<PrivateRoute exact path={routeConstants.EVENT_REF} component={EventSummary} />
		<PrivateRoute exact path={routeConstants.EVENT_REF_TASTINGS} component={EventTastingList} />
		<PrivateRoute exact path={routeConstants.EVENT_REF_TASTINGS_REF} component={EventTasting} />
		{/* Teams module */}
		<PrivateRoute path={routeConstants.MY_TEAMS} exact component={MyTeams} />
		<PrivateRoute path={routeConstants.FIND_TEAMS} exact component={FindTeams} />
		<PrivateRoute path={routeConstants.TEAM_HANDLE} exact component={TeamDetails} />
		{/* Teams Events module */}
		<PrivateRoute path={routeConstants.TEAM_EVENTS_NEW} exact component={NewEvent} />
		{/* All demos */}
		<PrivateRoute path={routeConstants.DEMO_AUTOSUGGEST} exact component={AutoSuggestDemo} />
		<PrivateRoute path={routeConstants.DEMO_SEARCH} exact component={SearchDemo} />
		<PrivateRoute path={routeConstants.DEMO_WINE_LIST} exact component={WineList} />
		<Route path={routeConstants.DEMO_CHANGE_PAYMENT} exact component={PaymentProfileForm} />
		<Route path={routeConstants.DEMO_SUBSCRIBE} exact component={SubscriptionForm} />
		{/* System pages */}
		<Route
			exact
			path={routeConstants.DEVELOPMENT_SETTINGS}
			component={() => <DevelopmentSettings />}
		/>
		<Route path={routeConstants.MAINTENANCE} exact component={Maintenance} />
		<Route path={routeConstants.PRIVATE_MODE_ERROR} exact component={PrivateModeError} />
		<Route path={routeConstants.ERROR_CANNOT_RECOVER} exact component={ErrorBoundaryFallback} />
		<Route path="*" exact component={NotFound} />
	</Switch>
);

class App extends Component {
	constructor(props) {
		super(props);

		const localStorageAvailable = this.isLocalStorageAvailable();
		const privateModeError = !localStorageAvailable;

		this.state = {
			currentRoute: '',
			additionalAppBodyClasses: [],
			privateModeError,
		};

		this.handleNavOffSet = this.handleNavOffSet.bind(this);

		if (localStorageAvailable) {
			this.validateBuildVersion();
		}
	}

	ntbl = {
		config: (options) => {
			if (Object.keys(options).length !== 0) {
				let obj = {};

				if (options.serverUrl && options.serverUrl !== '') {
					obj.serverUrl = options.serverUrl;
				}
				if (options.demoMode || options.demoMode === 0 || options.demoMode === false) {
					obj.demoMode = options.demoMode === 1 || options.demoMode === true;
				}
				if (options.fullVersion || options.fullVersion === 0 || options.fullVersion === false) {
					obj.fullVersion = options.fullVersion === 1 || options.fullVersion === true;
				}

				this.props.saveAdvancedOptions(obj);
			}
		},
	};

	isLocalStorageAvailable() {
		try {
			localStorage.setItem('isLocalStorageAvailable', true);
			localStorage.removeItem('isLocalStorageAvailable');
			return true;
		} catch (ex) {
			if (ex.code === DOMException.QUOTA_EXCEEDED_ERR && localStorage.length === 0) {
				return false;
			} else {
				throw ex;
			}
		}
	}

	validateBuildVersion = () => {
		if (localStorage.getItem('buildVersion') !== appConfig.BUILD_VERSION) {
			const mem = localStorage.getItem('mem');
			localStorage.clear();
			localStorage.setItem('mem', mem);
		}
		localStorage.setItem('buildVersion', appConfig.BUILD_VERSION);
		return true;
	};

	populateAdvancedOptions = (options) => {
		let obj = {};
		if (options.api && options.api !== '') {
			obj.serverUrl = options.api;
		}
		if (options.demo || options.demo === 0) {
			let demo = options.demo.toString();
			obj.demoMode = demo === '1';
		}
		if (options.full || options.full === 0) {
			let full = options.full.toString();
			obj.fullVersion = full === '1';
		}
		return obj;
	};

	componentDidMount() {
		const {
			location: {search},
			history,
			saveAdvancedOptions,
		} = this.props;
		const queryString = parse(search);

		if (Object.keys(queryString).length !== 0) {
			let data = this.populateAdvancedOptions(queryString);
			saveAdvancedOptions(data);
		}

		this.unlisten = history.listen((location, action) => {
			window.requestAnimationFrame(() => {
				window.scrollTo(0, 0);
			});
			if (location.pathname === routeConstants.APP_RESET) {
				localStorage.clear();
				window.location.href = routeConstants.LOG_IN;
			}
		});

		window.ntbl = this.ntbl;

		window.gotoUrl = history.push;
	}

	handleNavOffSet(isOffCanvas, offCanvasClass, isSideNavOpen) {
		let additionalAppBodyClasses = [];

		if (isOffCanvas) {
			additionalAppBodyClasses.push(offCanvasClass);
			if (isSideNavOpen) {
				additionalAppBodyClasses.push('nav-is-open');
			}
		}
		this.setState({additionalAppBodyClasses: additionalAppBodyClasses});
	}

	componentWillUnmount() {
		this.unlisten();
	}

	fullSiteWrapperUrl = [];
	notHeaderPage = ['tasting-result', 'wine-details'];

	render() {
		let {additionalAppBodyClasses, privateModeError} = this.state;
		const {location, isAuthenticated} = this.props;

		bugsnagClient.use(bugsnagReact, React);
		const ErrorBoundary = bugsnagClient.getPlugin('react');
		const fullMode = this.fullSiteWrapperUrl.filter((url) => location.pathname.includes(url));
		const hideHeader = this.notHeaderPage.filter((url) => location.pathname.includes(url));
		const hasWrappingStyles = !isBlankWrapper(location.pathname);
		const CurrentSiteWrapper = getSiteWrapper(location.pathname);

		if (privateModeError && !location.pathname.includes(routeConstants.PRIVATE_MODE_ERROR)) {
			return <Redirect to={routeConstants.PRIVATE_MODE_ERROR} />;
		}

		if (location.pathname === routeConstants.NEW_TASTING) {
			return <Redirect to={routeConstants.TASTING} />;
		}

		const footerComponent = {
			[routeConstants.MY_TASTINGS]: (
				<div className="center App__FooterNav nav_newTasting">
					<Link to={routeConstants.TASTING}>
						<Button infoKey="nav_newTasting" data-test="nav_newTasting" onHandleClick="">
							<L18nText id="nav_newTasting" defaultMessage="New tasting" />
						</Button>
					</Link>
				</div>
			),
		};

		return (
			<IntlProvider>
				<div
					className={classNames('wrapper app-wrapper', {
						touch: isTouchScreen(),
						authenticated: isAuthenticated,
					})}
				>
					<div
						id="main-content"
						className={classNames(additionalAppBodyClasses, {
							'App-body': hasWrappingStyles,
						})}
					>
						<ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
							<GhostVersion />
							<CurrentSiteWrapper
								menu={<ConnectedSiteMenu />}
								fullMode={!!fullMode.length}
								hideHeader={hideHeader.length}
								handleNavOffSet={this.handleNavOffSet}
								footer={footerComponent[location.pathname]}
								fullVersionMode={this.props.fullVersionMode}
							>
								<div>
									<AppRoutes />
									<AppErrorModal />
								</div>
							</CurrentSiteWrapper>
						</ErrorBoundary>
					</div>
				</div>
			</IntlProvider>
		);
	}
}

function mapStateToProps(state) {
	return {
		fullVersionMode: state.app.advancedOptions.fullVersion,
		isAuthenticated: state.user.isLoggedIn,
	};
}

export default withRouter(connect(mapStateToProps, {saveAdvancedOptions})(App));

window.addEventListener(
	'touchstart',
	function onFirstTouch() {
		document.body.classList.add('touch');
		// we only need to know once that a human touched the screen, so we can stop listening now
		window.removeEventListener('touchstart', onFirstTouch, false);
	},
	false
);
