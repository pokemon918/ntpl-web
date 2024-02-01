import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SignedInNavLinks from './SignedInNavLinks';
import SignedOutNavLinks from './SignedOutNavLinks';
import OtherNavLinks from './OtherNavLinks';
import BottomNavLinks from './BottomNavLinks';
import SiteMenuOverlay from './SiteMenuOverlay';

import close from './close.png';
import './SiteMenu.scss';

class SiteMenu extends Component {
	state = {
		selectedTastingMenuId: '',
	};

	closeNav = (e) => {
		e.preventDefault();
		this.props.closeSideNav();
	};

	setTastingId = (item) => {
		if (item === this.state.selectedTastingMenuId) {
			return this.setState({selectedTastingMenuId: ''});
		}

		return this.setState({selectedTastingMenuId: item});
	};

	render() {
		const {selectedTastingMenuId} = this.state;
		const {isOpen, isAuthenticated, offCanvas, isSubMenuOpen} = this.props;

		let sideNavStatus = 'nav-close';
		let offCanvasClass = '';
		let menuLinks = null;

		if (isOpen) {
			sideNavStatus = 'nav-open';
		} else {
			sideNavStatus = 'nav-close';
		}

		if (offCanvas) {
			offCanvasClass = 'off-canvas';
		}

		let open = isOpen ? 'open' : 'close';

		if (isAuthenticated) {
			menuLinks = (
				<div className="SiteMenu__LinksContainer">
					{!isSubMenuOpen && (
						<React.Fragment>
							<SignedInNavLinks
								navBar={this.props.navBar}
								isSubMenuOpen={isSubMenuOpen}
								closeSideNav={this.props.closeSideNav}
								setTastingId={this.setTastingId}
								id={selectedTastingMenuId}
								fullVersionMode={this.props.fullVersionMode}
								onOpenSubMenu={this.props.onOpenSubMenu}
							/>
							<hr className="SiteMenu__NavSeparator" />
							<OtherNavLinks closeSideNav={this.props.closeSideNav} isAuthenticated />
						</React.Fragment>
					)}
				</div>
			);
		} else {
			menuLinks = (
				<div className="SiteMenu__LinksContainer">
					<SignedOutNavLinks
						navBar={this.props.navBar}
						setTastingId={this.setTastingId}
						id={selectedTastingMenuId}
						closeSideNav={this.props.closeSideNav}
						onOpenSubMenu={this.props.onOpenSubMenu}
					/>
					<hr className="SiteMenu__NavSeparator" />
					<OtherNavLinks closeSideNav={this.props.closeSideNav} />
				</div>
			);
		}

		return (
			<div className={classNames('SiteMenu__Wrapper', [sideNavStatus, offCanvasClass, open])}>
				{isOpen && <SiteMenuOverlay closeSideNav={this.props.closeSideNav} />}
				<div className="SiteMenu__Container" onClick={this.handleClick} data-testid="sitemenu">
					<a
						href="/"
						className="SiteMenu__CloseBtn"
						onClick={this.closeNav}
						data-testid="closeIcon"
					>
						<img src={close} alt="close" width="20px" height="20px" />
					</a>
					{menuLinks}
					{isOpen && isAuthenticated && <BottomNavLinks closeSideNav={this.props.closeSideNav} />}
				</div>
			</div>
		);
	}
}

SiteMenu.propTypes = {
	offCanvas: PropTypes.bool,
	isOpen: PropTypes.bool,
	isAuthenticated: PropTypes.bool,
	setOffCanvas: PropTypes.func,
	onOpenSubMenu: PropTypes.func.isRequired,
	onCloseSubMenu: PropTypes.func.isRequired,
	handleNavOffSet: PropTypes.func.isRequired,
	closeSideNav: PropTypes.func.isRequired,
};

export default SiteMenu;
