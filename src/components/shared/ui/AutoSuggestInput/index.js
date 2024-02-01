import React, {useLayoutEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TextInput from 'components/shared/ui/TextInput';
import {useClickOutside} from 'hooks';

import {moveSelectedItem, scrollToSelectedNode} from './functions';
import {useListFilter} from './hooks';
import './AutoSuggestInput.scss';

const autoSuggestInputsCleanup = {};

const AutoSuggestInput = ({
	infoName,
	label,
	items,
	valueKey,
	displayKey,
	onSelectItem,
	value = null,
	type = 'single',
	enableFreeText = false,
}) => {
	const [lastSelectedName, setLastSelectedName] = useState({name: value || ''});
	const [isChanged, setIsChanged] = useState(false);
	const isMulti = type === 'multi';

	const getValue = (item) => (item && item[valueKey]) || null;
	const getText = (item) => (item && item[displayKey]) || '';

	const wrapperNode = useRef();
	const listNode = useRef();
	const selectedNode = useRef();

	const getLastIndex = (text) => {
		return value.name.lastIndexOf(text);
	};

	const getLastWord = (start, end) => {
		return value.name.substring(start, end);
	};

	const afterChangeFilter = (newFilter) => {
		if (enableFreeText) {
			const matchedItem = items.find((i) => i[displayKey] === newFilter);
			if (matchedItem) {
				onSelectItem(matchedItem);
			} else {
				onSelectItem({[displayKey]: newFilter});
			}
		}
	};
	const {search, clearSearch, filteredList, onChangeFilter} = useListFilter(
		items,
		getText,
		enableFreeText,
		afterChangeFilter,
		type
	);

	useClickOutside(wrapperNode, () => {
		clearSearch();
	});

	useLayoutEffect(() => {
		if (filteredList.length > 0) {
			// this is supported on our target browsers, but unsupported on test environment
			if (typeof wrapperNode.current.scrollIntoView === 'function') {
				wrapperNode.current.scrollIntoView({behavior: 'smooth'});
			}
		}
	}, [filteredList]);

	autoSuggestInputsCleanup[infoName] = () => {
		onChangeFilter('');
		clearSearch();
	};

	const handleSettingSelectedItem = (item) => {
		onChangeFilter(getText(item));
		onSelectItem(item, autoSuggestInputsCleanup);
		clearSearch();
	};

	const getAllText = (item, selectedType, previousText) => {
		if (!item) {
			isMulti && setIsChanged(false);

			return {name: `${value.name}`};
		}

		if (!isMulti) {
			return item;
		}

		let allText = value.name;

		if (selectedType === 'keypress') {
			const lastAllTextIndex = getLastIndex(previousText);

			allText = getLastWord(0, lastAllTextIndex);
		} else {
			const lastIndex = getLastIndex(' ');
			allText = getLastWord(0, lastIndex + 1);
		}

		if (isMulti) {
			setLastSelectedName(item);
		}

		if (allText) {
			return {name: `${allText}${item.name} `};
		}

		return {name: `${item.name} `};
	};

	const handleSelectItem = (item, selectedType) => {
		setIsChanged(false);
		const [firstItem] = filteredList;
		let selectedItem = item && item[valueKey] ? item : firstItem;

		if (isMulti && selectedType) {
			const lastAllTextIndex = getLastIndex(' ');
			const allText = getLastWord(0, lastAllTextIndex);
			const selectedText = allText ? `${allText} ${item.name} ` : `${item.name} `;
			selectedItem = {name: selectedText};
		}

		if (isMulti && selectedType && isChanged) {
			const lastAllTextIndex = getLastIndex(lastSelectedName.name);
			const allText = getLastWord(0, lastAllTextIndex);

			selectedItem = {name: `${allText}${item.name} `};
		}

		return handleSettingSelectedItem(selectedItem);
	};

	const handleClearItem = () => {
		if (value) {
			handleSettingSelectedItem(null);
			if (enableFreeText) {
				onChangeFilter(getText(value));
			}
		}
	};

	const getLastText = () => {
		const lastAllTextIndex = getLastIndex(' ');

		return {name: getLastWord(lastAllTextIndex + 1)};
	};

	const moveSelectedIndex = (direction) => {
		let selectedName = lastSelectedName;

		if (!filteredList.length) {
			return;
		}

		if (isMulti && !isChanged) {
			selectedName = getLastText();
		}

		setIsChanged(true);
		const newItem = moveSelectedItem(direction, {
			filteredList,
			selectedItem: isMulti ? selectedName : value,
			getValue,
		});

		if (filteredList && !filteredList.length) {
			return;
		}

		onSelectItem(getAllText(newItem, 'keypress', selectedName.name));
		scrollToSelectedNode(listNode, selectedNode);
	};

	const keyboardEvents = {
		ArrowUp: () => moveSelectedIndex(-1),
		ArrowDown: () => moveSelectedIndex(1),
		Backspace: () => handleClearItem(),
		Enter: () => handleSelectItem(value),
		Escape: () => clearSearch(),
		Tab: () => clearSearch(),
	};

	const handleKeyboardEvent = (event) => {
		const callback = keyboardEvents[event.key];

		if ((isMulti && !callback) || event.key === 'Backspace') {
			handleSelectItem(' ');
		}

		if (callback) {
			callback();
		} else if (enableFreeText && isMulti) {
			handleClearItem();
		}
	};

	return (
		<div ref={wrapperNode} className="AutoSuggestInput__Container">
			<TextInput
				label={label}
				value={getText(value) || search}
				onChange={onChangeFilter}
				onKeyDown={handleKeyboardEvent}
			/>
			{filteredList.length > 0 && (
				<div ref={listNode} className="AutoSuggestInput__List">
					{filteredList.map((item) => {
						const selectedValue = isMulti ? lastSelectedName : value;
						const isSelected = isChanged ? getValue(item) === getValue(selectedValue) : false;

						return (
							<div
								key={getValue(item)}
								ref={isSelected ? selectedNode : null}
								className={classNames('AutoSuggestInput__Item', {
									isSelected,
								})}
								onClick={() => handleSelectItem(item, 'keypress')}
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

AutoSuggestInput.propTypes = {
	infoName: PropTypes.string,
	label: PropTypes.string,
	items: PropTypes.arrayOf(PropTypes.shape({})),
	valueKey: PropTypes.string,
	displayKey: PropTypes.string,
	onSelectItem: PropTypes.func,
};

AutoSuggestInput.defaultProps = {
	label: 'Search',
	items: [],
	onSelectItem: () => {},
};

export default AutoSuggestInput;
