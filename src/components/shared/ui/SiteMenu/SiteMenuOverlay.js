import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SiteMenuOverlay = (props) => {
	const [animate, setAnimate] = useState(false);

	// set an animation flag to transition the background colour smoothly
	useEffect(() => {
		setAnimate(true);
	}, []);

	return (
		<div
			className={classNames('SiteMenuOverlay', {animate})}
			onClick={(e) => {
				props.closeSideNav();
			}}
		/>
	);
};

SiteMenuOverlay.propTypes = {
	closeSideNav: PropTypes.func.isRequired,
};

export default SiteMenuOverlay;
