import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import L18nText from 'components/shared/L18nText';

class SelectionButton extends React.Component {
	render() {
		const {note, isEven, selectedItems, subHeader, getIsChecked = () => null} = this.props;
		const btnClass = classnames('NotesSelection__List__Item', {
			active: getIsChecked(note.id) || selectedItems.includes(note.id),
			odd: !isEven,
		});
		const handleSelect = () => this.props.onHandleClick(note.id);

		return (
			<div
				className={btnClass}
				onClick={handleSelect}
				data-note-id={note.id}
				data-test={`MultiSelectorOption_${note.name}`}
			>
				<L18nText id={note.name} defaultMessage={note.name} />
				{subHeader && (
					<div className="NotesSelection__List__SubHeader">
						(<L18nText id={subHeader} />)
					</div>
				)}
			</div>
		);
	}
}

SelectionButton.propTypes = {
	selectedItems: PropTypes.array,
	note: PropTypes.object.isRequired,
	onHandleClick: PropTypes.func.isRequired,
	getIsChecked: PropTypes.func,
};

export default SelectionButton;
