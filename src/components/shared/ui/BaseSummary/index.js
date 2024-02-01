import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import L18nText from 'components/shared/L18nText';
import './BaseSummary.scss';

const getValueStyle = (type, steps, value) => {
	switch (type) {
		case 'percent':
			if (value > 100) {
				value = 100;
			}

			if (value < 1) {
				value = 1;
			}

			return {width: `${value}%`};

		case 'position':
			const each = 100 / steps;
			const percent = !value ? 0 : (value - 1) * each;
			const width = !value ? 0 : each;
			return {
				marginLeft: `${percent}%`,
				width: `${width}%`,
			};

		default:
			return null;
	}
};

const countToNumber = (count) => new Array(count).fill(0).map((_, index) => index + 1);

const Steps = ({count}) => (
	<div className="BaseSummary__Steps">
		{countToNumber(count).map((n) => (
			<div key={n} className="BaseSummary__StepSeparator" />
		))}
	</div>
);

const BaseSummary = ({type, items, steps: baseSteps, rounded}) => (
	<div className="BaseSummary__Container">
		{items
			?.filter(({name, steps: itemSteps, value}) => name)
			.map(({name, steps: itemSteps, value}) => {
				const steps = itemSteps || baseSteps;
				return (
					<div key={name} className="BaseSummary__Item">
						<div className="BaseSummary__ItemName">
							<L18nText id={name} defaultMessage={name} />
						</div>
						<div className="BaseSummary__ItemValue">
							<div
								className={classNames('BaseSummary__ValueBar', {
									roundedCorners: rounded,
								})}
							>
								<div
									className={classNames('BaseSummary__ValueDisplay', {
										fullValue: type === 'percent' ? value >= 99 : value === steps,
									})}
									style={getValueStyle(type, steps, value)}
								/>
								<Steps count={steps} />
							</div>
						</div>
					</div>
				);
			})}
	</div>
);

BaseSummary.propTypes = {
	type: PropTypes.oneOf(['percent', 'position']),
	items: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			steps: PropTypes.number,
			value: PropTypes.number,
		})
	),
	steps: PropTypes.number,
	rounded: PropTypes.bool,
};

BaseSummary.defaultProps = {
	type: 'percent',
	steps: 4,
};

export default BaseSummary;
