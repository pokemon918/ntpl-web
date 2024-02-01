import React from 'react';
import PropTypes from 'prop-types';

import L18nText from 'components/shared/L18nText';

import ChevronUp from './Icon_ChevronUp.svg';
import ChevronDown from './Icon_ChevronDown.svg';
import './RadioSelection.scss';

class RadioSelection extends React.Component {
	state = {
		selected: {},
		items: [],
	};

	componentDidMount() {
		const {items} = this.props;
		this.setState({items});
	}

	handleChangeOption(selected) {
		const {items} = {...this.state};
		const {onChange} = this.props;

		items.forEach((item) => {
			if (item.id === selected.id) item.expand = true;
			else item.expand = false;
		});

		this.setState({selected, items});
		onChange(selected);
	}

	expandOptionDetails(index) {
		const {items} = {...this.state};
		if (items[index].expand) items[index].expand = false;
		else items[index].expand = true;

		this.setState({items});
	}

	getRadioItem = (item, index) => {
		const {expandable} = this.props;
		const selected = this.props.selected || this.state.selected;

		return (
			<div className="RadioSelection__Item__head">
				<input
					id={item.id}
					type="radio"
					value={item.id}
					checked={item.id === selected.id}
					onChange={() => this.handleChangeOption(item)}
					className={
						selected.id === item.id
							? 'RadioSelection__Item__head__selected'
							: 'RadioSelection__Item__head__unselected'
					}
				/>
				<div className="RadioSelection__ItemWrapper">
					<div className="RadioSelection__ItemContent">
						<label htmlFor={item.id} className="RadioSelection__Item__head__label">
							<L18nText id={item.label} defaultMessage={item.label} />
						</label>
						{expandable && (
							<button onClick={() => this.expandOptionDetails(index)}>
								<img src={item.expand ? ChevronUp : ChevronDown} alt="chevron" />
							</button>
						)}
					</div>
					<div
						className={`RadioSelection__Item__body ${
							item.expand ? 'RadioSelection__Item__body__display' : ''
						}`}
					>
						{item.description}
					</div>
				</div>
			</div>
		);
	};

	render() {
		const {items} = this.state;
		return (
			<div className="RadioSelection__Container">
				{items.map((item, i) => {
					return (
						<div key={i} className="RadioSelection__Item">
							{this.getRadioItem(item, i)}
						</div>
					);
				})}
			</div>
		);
	}
}

RadioSelection.propTypes = {
	selected: PropTypes.shape({
		id: PropTypes.string,
	}),
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			label: PropTypes.string,
			description: PropTypes.node,
		})
	).isRequired,
	onChange: PropTypes.func.isRequired,
	expandable: PropTypes.bool,
};

export default RadioSelection;
