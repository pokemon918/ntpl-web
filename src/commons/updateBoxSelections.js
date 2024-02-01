function updateBoxSelections(tastingType, tastingSrc, selectionKey, selections, activeSelection) {
	switch (selectionKey) {
		case 'winetype_':
			selections.forEach((newSelection, index) => {
				if (newSelection.key === 'color_') {
					newSelection.hideSelection = false;
					newSelection.activeOption = null;
					newSelection.options = tastingSrc['color_'];
					newSelection.winetype_ = activeSelection.activeOption;
				}
			});
			break;
		case 'color_':
			selections.forEach((newSelection, index) => {
				// Reset nuance
				if (newSelection.key === 'nuance_tint_') {
					newSelection.hideSelection = false;
					newSelection.activeOption = null;
					newSelection.options = tastingSrc[activeSelection.activeOption];
					newSelection.nuance_tint_ = activeSelection.activeOption;
				}

				// Clear clarity and appearance
				if (newSelection.key === 'clarity__' || newSelection.key === 'colorintensity__') {
					newSelection.hideSelection = true;
					newSelection.activeOption = null;
					delete newSelection.nuance_tint_;
					delete newSelection.clarity__;
				}
			});
			break;
		case 'nuance_tint_':
			if (tastingType === 'scholar4' || tastingType === 'scholar2' || tastingType === 'scholar2m') {
				selections.forEach((newSelection, index) => {
					if (newSelection.key === 'colorintensity__') {
						newSelection.hideSelection = false;
						newSelection.activeOption = null;
						newSelection.options = tastingSrc['colorintensity__'];
						newSelection.nuance_tint_ = activeSelection.activeOption;
					}
				});
				break;
			}

			if (tastingType !== 'light') {
				selections.forEach((newSelection, index) => {
					// show clarity
					if (newSelection.key === 'clarity__') {
						newSelection.hideSelection = false;
						newSelection.activeOption = null;
						newSelection.nuance_tint_ = activeSelection.activeOption;
					}

					// Clear appearance
					if (newSelection.key === 'colorintensity__') {
						newSelection.hideSelection = true;
						newSelection.activeOption = null;
						delete newSelection.nuance_tint_;
						delete newSelection.clarity__;
					}
				});
				break;
			} else {
				let nuance_tint_ = {};

				selections.forEach((newSelection, index) => {
					if (newSelection.key === 'nuance_tint_') nuance_tint_ = newSelection;

					// show clarity
					if (newSelection.key === 'colorintensity__') {
						newSelection.hideSelection = false;
						newSelection.nuance_tint_ = nuance_tint_.activeOption;
						newSelection.clarity__ = activeSelection.activeOption;
					}
				});
				break;
			}
		case 'clarity__':
			let nuance_tint_ = {};

			selections.forEach((newSelection, index) => {
				if (newSelection.key === 'nuance_tint_') nuance_tint_ = newSelection;

				// show clarity
				if (newSelection.key === 'colorintensity__') {
					newSelection.hideSelection = false;
					newSelection.nuance_tint_ = nuance_tint_.activeOption;
					newSelection.clarity__ = activeSelection.activeOption;
				}
			});
			break;
		default:
		// do nothing
	}
}

export default updateBoxSelections;
