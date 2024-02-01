import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dateFns from 'date-fns';

import './YearPicker.scss';
import L18nText from 'components/shared/L18nText';

class YearPicker extends React.Component {
	constructor() {
		super();
		this.state = {
			minYear: dateFns.getYear(dateFns.subYears(new Date(), 8)),
			maxYear: dateFns.getYear(new Date()),
			selectedYear: null,
		};
	}

	componentDidMount() {
		this.setState({selectedYear: this.props.selectedYear});
	}

	selectYear(year) {
		const {onSelect} = this.props;
		this.setState({selectedYear: year});
		onSelect({[this.props.infoKey]: year});
	}

	populateYears() {
		const {minYear, maxYear, selectedYear} = this.state;
		const years = [];
		for (let i = minYear; i <= maxYear; i++) years.push(i);

		return (
			<ul className="YearPicker__Year" data-view="years">
				{years.map((year, i) => {
					const selected = year === selectedYear;
					const disabled = year > dateFns.getYear(new Date());
					return (
						<li
							key={i}
							className={classNames('YearPicker__Items', {selected, disabled})}
							data-test={`YearPicker__value__${year}`}
							onClick={() => {
								if (!disabled) this.selectYear(year);
							}}
						>
							{year}
						</li>
					);
				})}
			</ul>
		);
	}

	changeRange(action) {
		const {minYear, maxYear} = this.state;
		if (action === 'forward') this.setState({minYear: minYear + 9, maxYear: maxYear + 9});
		else if (action === 'back') this.setState({minYear: minYear - 9, maxYear: maxYear - 9});
	}

	render() {
		const {selectedYear} = this.state;
		const disabled = this.state.maxYear > dateFns.getYear(new Date());
		const yearPickerClass = classNames('YearPicker__Container');

		return (
			<div className={yearPickerClass}>
				<div className="YearPicker__Header">
					<div
						className="YearPicker__Prev"
						data-test="YearPicker__prevYearsBtn"
						onClick={() => this.changeRange('back')}
					>
						<span>&lsaquo;</span>
					</div>
					<div className="yearpicker-current">
						{selectedYear ? selectedYear : <L18nText id="app_select_year" message="Select Year" />}
					</div>
					<div
						className={classNames('YearPicker__Next', {disabled})}
						data-test="YearPicker__nextYearsBtn"
						onClick={() => {
							if (!disabled) this.changeRange('forward');
						}}
					>
						<span>&rsaquo;</span>
					</div>
				</div>
				<div className="yearpicker-body">{this.populateYears()}</div>
				<div className="YearPicker__Footer">
					<div
						className="YearPicker__NoSelect"
						data-test="YearPicker__value__nonVintage"
						onClick={() => this.selectYear(null)}
					>
						<L18nText id="app_non_vintage" message="Non Vintage" />
					</div>
				</div>
			</div>
		);
	}
}

YearPicker.propTypes = {
	onSelect: PropTypes.func,
	isStatic: PropTypes.bool,
};

YearPicker.defaultProps = {
	onSelect: () => {},
	isStatic: false,
};

export default YearPicker;
