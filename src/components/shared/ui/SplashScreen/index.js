import React from 'react';
import PropTypes from 'prop-types';

import './SplashScreen.scss';

class SplashScreen extends React.Component {
	render() {
		const {text, onNavigation} = this.props;

		return (
			<div className="SplashScreen_Wrapper" onClick={onNavigation}>
				<span className="SplashScreen_Container">{text}</span>
			</div>
		);
	}
}

SplashScreen.propTypes = {
	text: PropTypes.string.isRequired,
	onNavigation: PropTypes.func,
};

export default SplashScreen;
