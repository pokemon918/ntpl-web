import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {ReactComponent as SpinnerIcon} from './spinner.svg';
import './Spinner.scss';

const Spinner = ({position, light, inline, small, transparent}) => (
	<div className={classNames('Spinner__Wrapper', [position], {light, inline, small, transparent})}>
		<SpinnerIcon />
	</div>
);

Spinner.propTypes = {
	position: PropTypes.bool,
	light: PropTypes.bool,
	inline: PropTypes.bool,
	small: PropTypes.bool,
	transparent: PropTypes.bool,
};

export default Spinner;
