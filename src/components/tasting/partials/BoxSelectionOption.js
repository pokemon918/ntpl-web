import React, {Component} from 'react';
import {connect} from 'react-redux';
import L18nText from 'components/shared/L18nText';

import {ReactComponent as FortifiedIcon} from './img/icon-wine-fortified.svg';
import {ReactComponent as SparklingIcon} from './img/icon-wine-sparkling.svg';
import {ReactComponent as StillIcon} from './img/icon-wine-still.svg';
import {ReactComponent as SelectedRadioIcon} from './img/icon-selected-radio.svg';
import {ReactComponent as NotSelectedRadioIcon} from './img/icon-not-selected-radio.svg';

const selectedIcon = {
	category_still: <StillIcon />,
	category_fortified: <FortifiedIcon />,
	category_sparkling: <SparklingIcon />,
};

class BoxSelectionOption extends Component {
	render() {
		const {selectionName, selectionKey, option, nuance, clarity, isChecked} = this.props;
		let paletteClasses = ['option-color-pallette', nuance, clarity, option];

		return (
			<div className="col-sm box-selection-option" data-test={`BoxSelectionOption_${option}`}>
				<label className="form-check-label" htmlFor={'id_' + option}>
					<L18nText id={option} defaultMessage={option} />
					<br />
					{selectionKey === 'winetype_' ? (
						<div className="option-wine-pallette">{selectedIcon[option]}</div>
					) : (
						<div className={paletteClasses.join(' ')}> </div>
					)}
					<div className="inner">
						<input
							type="radio"
							id={'id_' + option}
							name={selectionName}
							value={option}
							onChange={(e) => this.props.handleOptionSelect(e, selectionKey)}
							checked={isChecked}
						/>
						{isChecked ? <SelectedRadioIcon /> : <NotSelectedRadioIcon />}
					</div>
				</label>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
	};
}

export default connect(mapStateToProps)(BoxSelectionOption);
