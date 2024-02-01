function moveSelectedItem(direction, {filteredList, selectedItem, getValue}) {
	const currentIndex = selectedItem
		? filteredList.findIndex((i) => getValue(i) === getValue(selectedItem))
		: -1;

	let newIndex = currentIndex + direction;

	// hop to the other edge when navigating out of bounds
	if (newIndex < 0) {
		newIndex = filteredList.length - 1;
	} else if (newIndex >= filteredList.length) {
		newIndex = 0;
	}

	const newItem = filteredList[newIndex];
	return newItem;
}

export default moveSelectedItem;
