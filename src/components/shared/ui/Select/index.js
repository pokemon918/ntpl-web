import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextInput from 'components/shared/ui/TextInput';

import {useClickOutside} from 'hooks';
import {useListFilter} from './hooks';

import './Select.scss';

const Select = ({label, items, valueKey, displayKey, onSelectItem, customClass, disabled}) => {
	const getValue = (item) => (item && item[valueKey]) || null;

	const getText = (item) => `${item[displayKey]} ${item[valueKey]}` || '';

	const [selectedItem, setSelectedItem] = useState(valueKey);

	const [visible, setVisible] = useState(false);
	const [searchPhone, setSearchPhone] = useState('');

	const wrapperNode = useRef();

	const {onChangeFilter, filteredList} = useListFilter(items, displayKey);
	useClickOutside(wrapperNode, () => setVisible(false));

	const handleSelectItem = (item) => {
		setSelectedItem(item);
		onChangeFilter(getText(item));
		onSelectItem(item);
		setVisible(false);
		setSearchPhone(getValue(item));
	};

	const handleChange = (item) => {
		setSearchPhone(item);
	};

	return (
		<div ref={wrapperNode} className="Select__Container">
			<div onClick={() => setVisible(true)} className="Select__Field">
				<TextInput type="text" onChange={handleChange} value={searchPhone || label} />
			</div>
			{visible && (
				<div className="Select__List">
					{filteredList
						.filter(
							(item) =>
								(item.name && item.name.toLowerCase().includes(searchPhone.toLowerCase())) ||
								(item.phone && item.phone.includes(searchPhone))
						)
						.map((item) => {
							const isSelected = getValue(item) === getValue(selectedItem);
							return (
								<div
									key={item}
									className={classNames('Select__Item', {
										isSelected,
									})}
									onClick={() => handleSelectItem(item)}
									data-test="select_field"
								>
									{getText(item)}
								</div>
							);
						})}
				</div>
			)}
		</div>
	);
};

Select.propTypes = {
	label: PropTypes.string,
	valueKey: PropTypes.string,
	displayKey: PropTypes.string,
	onSelectItem: PropTypes.func,
	items: PropTypes.arrayOf(PropTypes.shape({})),
};

Select.defaultProps = {
	items: [],
	onSelectItem: () => {},
};

export default Select;
