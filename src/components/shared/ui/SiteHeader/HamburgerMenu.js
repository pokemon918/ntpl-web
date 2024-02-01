import React from 'react';
import PropTypes from 'prop-types';

const HamburgerMenu = ({onMenuClick}) => (
	<div className="SiteHeader_Hamburger" data-testid="hamburger-menu" onClick={onMenuClick}>
		<div className="SiteHeader_Hamburger_Item" />
		<div className="SiteHeader_Hamburger_Item" />
		<div className="SiteHeader_Hamburger_Item" />
	</div>
);

HamburgerMenu.propTypes = {
	onMenuClick: PropTypes.func,
};

export default HamburgerMenu;
