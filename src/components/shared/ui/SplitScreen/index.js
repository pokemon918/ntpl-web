import React from 'react';
import PropTypes from 'prop-types';

import './SplitScreen.scss';
import SplitScreenItem from './SplitScreenItem';

const SplitScreen = ({upperChildren, lowerChildren}) => (
	<div className="SplitScreen_Wrapper">
		<SplitScreenItem>{upperChildren}</SplitScreenItem>
		<SplitScreenItem>{lowerChildren}</SplitScreenItem>
	</div>
);

SplitScreen.propTypes = {
	upperChildren: PropTypes.node,
	lowerChildren: PropTypes.node,
};

export default SplitScreen;
