import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withRouter} from 'react-router-dom';
import {RevealGlobalStyles} from 'react-genie';
import {parse} from 'query-string';

import SiteHeader from '../SiteHeader';

import './SiteWrapper.scss';
import '../SiteFooter/SiteFooter.scss';
import {routeConstants} from 'const';

class SiteWrapper extends React.Component {
	state = {
		isEmbedded: false,
		isMenuOpen: false,
		isSubMenuOpen: false,
	};

	componentDidMount() {
		this.shouldEmbed();
		window.addEventListener('beforeunload', this.clearEmbed);
	}

	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.clearEmbed);
	}

	shouldEmbed = () => {
		const {embed} = parse(window.location.search);

		// determine from session storage after a rerender on new routes whether embedding is active for this session
		if (typeof embed === 'undefined' && sessionStorage.getItem('embed') === 'true') {
			this.setState({isEmbedded: true});
			return;
		}

		// embedding is requested for the current session, persist on session storage for rerenders on new routes
		if (embed === '1' || embed === 'true') {
			this.setState({isEmbedded: true});
			sessionStorage.setItem('embed', 'true');
			return;
		}

		// any other value will disable embedding and remove the entry from session storage
		this.clearEmbed();
	};

	clearEmbed = () => {
		sessionStorage.removeItem('embed');
	};

	onCloseMenu = () => {
		document.body.classList.remove('SiteMenuOpen');
		this.setState({isMenuOpen: false});
		this.setState({isSubMenuOpen: false});
	};

	onOpenMenu = () => {
		document.body.classList.add('SiteMenuOpen');
		this.setState({isMenuOpen: true});
	};

	onOpenSubMenu = () => {
		this.setState({isSubMenuOpen: true});
	};

	onCloseSubMenu = () => {
		this.setState({isSubMenuOpen: false});
	};

	render() {
		const {
			children,
			menu,
			fullMode,
			location = {},
			hideHeader,
			mustLoginAgain,
			isAuthenticated,
			handleNavOffSet,
			subscription,
			userData,
			footer,
		} = this.props;
		const {isEmbedded} = this.state;
		const hideMenu = [routeConstants.BILLING, routeConstants.SUBSCRIPTION].includes(
			location.pathname
		);

		return (
			<div className={classNames('Background__Wrapper', {isEmbedded})}>
				<RevealGlobalStyles />
				{hideHeader ? null : (
					<div className="Header">
						<SiteHeader
							isOnlyHamburgerView={fullMode || hideMenu}
							onMenuClick={this.onOpenMenu}
							isAuthenticated={isAuthenticated}
							mustLoginAgain={mustLoginAgain}
							subscription={subscription}
							userData={userData}
						/>
					</div>
				)}
				{menu &&
					React.cloneElement(menu, {
						isOpen: this.state.isMenuOpen,
						isSubMenuOpen: this.state.isSubMenuOpen,
						closeSideNav: this.onCloseMenu,
						onOpenSubMenu: this.onOpenSubMenu,
						onCloseSubMenu: this.onCloseSubMenu,
						handleNavOffSet: handleNavOffSet,
						isAuthenticated: isAuthenticated,
						fullVersionMode: this.props.fullVersionMode,
					})}
				<div className="Body">{children}</div>
				{footer && <div className="SiteFooter__Container">{footer}</div>}
			</div>
		);
	}
}

SiteWrapper.propTypes = {
	fullMode: PropTypes.bool,
	hideHeader: PropTypes.number,
	children: PropTypes.node,
	footer: PropTypes.node,
};

function mapStateToProps(state) {
	return {
		subscription: state.app.subscription,
		userData: state.user.userData,
		mustLoginAgain: state.appErrorModal && state.appErrorModal.mustLoginAgain,
		isAuthenticated: state.user.isLoggedIn,
	};
}

export {SiteWrapper as UnconnectedSiteWrapper};

export default connect(mapStateToProps)(withRouter(SiteWrapper));
