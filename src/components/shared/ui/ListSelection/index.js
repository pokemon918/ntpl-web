import React from 'react';
import PropTypes from 'prop-types';

import './ListSelection.scss';
import SelectionItem from './ListSelectionItem';

class ListSelection extends React.Component {
	state = {
		selectedItem: {},
	};

	componentDidMount() {
		this.setState({
			selectedItem: this.props.selected,
		});
	}

	onHandleClick = (item) => {
		this.setState({selectedItem: item});
		this.props.onSelect(item);
	};

	render() {
		const {selectedItem = {}} = this.state;
		const {items, type} = this.props;

		return (
			<div className="ListSelection__Wrapper">
				{items.map((item) => {
					const isActive = item.id === selectedItem.id;

					return (
						<SelectionItem
							type={type}
							key={item.id}
							id={item.id}
							name={item.name}
							isActive={isActive}
							onSelect={() => this.onHandleClick(item)}
						/>
					);
				})}
			</div>
		);
	}
}

ListSelection.propTypes = {
	onSelect: PropTypes.func,
	selected: PropTypes.shape({id: PropTypes.string, name: PropTypes.string}),
	items: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.string, name: PropTypes.string})),
};

export default ListSelection;
