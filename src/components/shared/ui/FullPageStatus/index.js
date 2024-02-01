import React from 'react';
import PropTypes from 'prop-types';
import {Reveal} from 'react-genie';

import L18nText from 'components/shared/L18nText';
import Grid from 'components/shared/ui/Grid';
import './FullPageStatus.scss';

const FullPageStatus = ({animate, title, children}) => {
	const Wrapper = animate ? Reveal : 'div';

	return (
		<div className="FullPageStatus__Container">
			<Grid columns={8}>
				<div className="FullPageStatus__Text">
					<Wrapper>
						<h2 className="Title">
							<L18nText id={title} />
						</h2>
						<div className="Description">{children}</div>
					</Wrapper>
				</div>
			</Grid>
		</div>
	);
};

FullPageStatus.propTypes = {
	animate: PropTypes.bool,
	title: PropTypes.string,
	children: PropTypes.node,
};

export default FullPageStatus;
