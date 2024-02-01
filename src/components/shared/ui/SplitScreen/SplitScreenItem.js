import React from 'react';
import PropTypes from 'prop-types';

import './SplitScreen.scss';

const SplitScreenItem = ({children}) => <div className="SplitScreen_Item_Wrapper">{children}</div>;

SplitScreenItem.propTypes = {
	children: PropTypes.node,
};

export default SplitScreenItem;
