import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import L18nText from 'components/shared/L18nText';
import {useClickOutside} from 'hooks';
import {useListFilter} from './hooks';

import './Dropdown.scss';

const Dropdown = ({
	label = '',
	items,
	value = '',
	infoKey = '',
	valueKey = 'value',
	displayKey = 'description',
	loadOnUpdate = false,
	getDisplayValue = () => '',
	testKey = '',
	onSelectItem,
	customClass = '',
	disabled = false,
}) => {
	const getValue = (item) => (typeof item === 'object' ? item && item[valueKey] : item) || null;
	const getText = (item) => (typeof item === 'object' ? item && item[displayKey] : item) || '';
	const getTestKey = (item) => (item && item[testKey]) || '';
	const [selectedItem, setSelectedItem] = useState(value);
	const currentDisplayValue = loadOnUpdate
		? label
		: getDisplayValue(getValue(selectedItem)) || getValue(selectedItem) || label;

	const [visible, setVisible] = useState(false);
	const wrapperNode = useRef();
	const activeValue = loadOnUpdate ? label : displayKey;

	const {onChangeFilter, filteredList} = useListFilter(items, activeValue);
	useClickOutside(wrapperNode, () => setVisible(false));

	const handleSelectItem = (item) => {
		setSelectedItem(item);
		onChangeFilter(getText(item));
		onSelectItem(item);
		setVisible(false);
	};

	const dropdownValue = classNames('Dropdown__Value', {
		[customClass]: customClass,
		disabled,
	});

	return (
		<div ref={wrapperNode} className="Dropdown__Container">
			<div
				className={dropdownValue}
				data-test={`Dropdown__${infoKey}`}
				onClick={() => setVisible(true)}
			>
				{currentDisplayValue && (
					<L18nText id={currentDisplayValue} defaultMessage={currentDisplayValue} />
				)}
			</div>
			{visible && (
				<div className="Dropdown__List">
					{filteredList.map((item) => {
						const isSelected = getValue(item) === loadOnUpdate ? label : getValue(selectedItem);
						const itemDisplayText = getText(item);
						return (
							<div
								key={getValue(item)}
								className={classNames('Dropdown__Item', {
									isSelected,
								})}
								onClick={() => handleSelectItem(item)}
								data-test={`Dropdown__${infoKey}__value__${getTestKey(item)}`}
							>
								<L18nText id={itemDisplayText} defaultMessage={itemDisplayText} />
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

Dropdown.propTypes = {
	label: PropTypes.string,
	value: PropTypes.string,
	infoKey: PropTypes.string,
	valueKey: PropTypes.string,
	displayKey: PropTypes.string,
	getDisplayValue: PropTypes.func,
	onSelectItem: PropTypes.func,
	items: PropTypes.arrayOf(PropTypes.shape({})),
};

Dropdown.defaultProps = {
	items: [],
	getDisplayValue: () => null,
	onSelectItem: () => {},
};

export default Dropdown;
