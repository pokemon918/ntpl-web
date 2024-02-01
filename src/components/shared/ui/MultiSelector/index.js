import React from 'react';
import PropTypes from 'prop-types';

import './MultiSelector.scss';
import SelectionButton from './SelectionButton';
import {getTastingType} from 'components/tasting/common';
import TouchSelect from './TouchSelect';

const subHeader = {
	quick: {
		notes_red_: {
			notes_herbal_: 'note_herbaceous',
		},
		notes_sparkling_white_: {
			notes_herbal_: 'note_herbaceous',
			note_lees: 'note_autolytic',
		},
		notes_sparkling_red_: {
			notes_herbal_: 'note_herbaceous',
			note_lees: 'note_autolytic',
		},
		notes_sparkling_orange_: {
			notes_herbal_: 'note_herbaceous',
			note_lees: 'note_autolytic',
		},
		notes_sparkling_rose_: {
			notes_herbal_: 'note_herbaceous',
			note_lees: 'note_autolytic',
		},
		notes_fortified_sherry_white_: {
			notes_herbal_: 'note_herbaceous',
			note_lees: 'note_flor',
			note_orange: 'note_orange_peel',
		},
		notes_fortified_white_: {
			notes_herbal_: 'note_herbaceous',
		},
		notes_fortified_red_: {
			notes_herbal_: 'note_herbaceous',
			note_orange: 'note_orange_peel',
		},
		notes_fortified_default_: {
			notes_herbal_: 'note_herbaceous',
		},
	},
	scholar4: {
		tertiary_red_wine: {
			trait_petillance: 'note_still_wines',
			note_dried: 'note_prune_raisin_fig',
			note_fruits_cooked: 'note_cooked_plum_cooked_cherry',
		},
		tertiary_white_wine: {
			note_petrol: 'note_gasoline',
			note_dried: 'note_dried_apricot_raisin',
		},
		tasting_other_observation: {
			trait_petillance: 'note_still_wines',
		},
		notes_herbal_: {
			note_herbs_dried: 'note_thyme_oregano',
		},
	},
	scholar2: {
		tertiary_white_wine: {
			note_petrol: 'note_gasoline',
		},
	},
};
subHeader.swa20 = subHeader.quick;

class MultiSelector extends React.Component {
	state = {
		selectedItem: [],
	};

	componentDidMount() {
		this.setState({
			selectedItem: this.props.notes.filter((note) => note.isActive).map((note) => note.id),
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			selectedItem: nextProps.notes.filter((note) => note.isActive).map((note) => note.id),
		});
	}

	onHandleClick = (item) => {
		const {selectedItem} = this.state;

		if (selectedItem.includes(item)) {
			selectedItem.splice(selectedItem.indexOf(item), 1);
			this.setState({selectedItem});

			return this.props.onHandleSelect(item);
		}

		this.setState({selectedItem: [...this.state.selectedItem, item]});
		this.props.onHandleSelect(item);
	};

	render() {
		const {selectedItem} = this.state;
		const {notes = [], customClass, type, selectionKey, getIsChecked} = this.props;
		const isEven = notes.length % 2 === 0;
		const tastingType = getTastingType(type);

		return (
			<TouchSelect onSelect={this.onHandleClick}>
				<div className="NotesSelection__List">
					{notes.map((note, index) => (
						<SelectionButton
							key={index}
							isEven={isEven}
							note={note}
							subHeader={
								subHeader[tastingType] &&
								subHeader[tastingType][selectionKey] &&
								subHeader[tastingType][selectionKey][note.name]
							}
							customClass={customClass}
							selectedItems={selectedItem}
							onHandleClick={this.onHandleClick}
							getIsChecked={getIsChecked}
						/>
					))}
				</div>
			</TouchSelect>
		);
	}
}

MultiSelector.propTypes = {
	customClass: PropTypes.string,
	notes: PropTypes.array.isRequired,
	onHandleSelect: PropTypes.func.isRequired,
	getIsChecked: PropTypes.func,
};

export default MultiSelector;
