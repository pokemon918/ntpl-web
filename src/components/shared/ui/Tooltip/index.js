import React from 'react';
import ReactTooltip from 'react-tooltip';
import shortid from 'shortid';
import classNames from 'classnames';

import './Tooltip.scss';
import L18nText from 'components/shared/L18nText';

const Tooltip = ({text, children, show = true, sticky, place = 'bottom'}) => {
	const tooltipRef = shortid.generate();
	const tooltipClassName = classNames({
		Tolltip__Wrapper_Sticky: sticky,
	});

	return (
		<span className={tooltipClassName}>
			<span data-tip data-for={tooltipRef}>
				{children}
			</span>
			{show && (
				<ReactTooltip id={tooltipRef} place={place} effect="solid" className="hoverTooltip">
					<L18nText id={text} defaultMessage={text} />
				</ReactTooltip>
			)}
		</span>
	);
};

export default Tooltip;
