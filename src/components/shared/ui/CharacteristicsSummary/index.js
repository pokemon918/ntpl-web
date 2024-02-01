import React from 'react';
import PropTypes from 'prop-types';
import L18nText from 'components/shared/L18nText';

import BaseSummary from '../BaseSummary';

import './CharacteristicsSummary.scss';

const CharacteristicsSummary = ({characteristics, displayHeader = true}) => (
	<div className="CharacteristicsSummary__Container">
		{displayHeader && (
			<header>
				<L18nText id="rating_characteristics" defaultMessage="Characteristics" />
			</header>
		)}
		<BaseSummary type="position" items={characteristics} />
	</div>
);

CharacteristicsSummary.propTypes = {
	characteristics: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			steps: PropTypes.number,
			value: PropTypes.number,
		})
	),
};

export default CharacteristicsSummary;
