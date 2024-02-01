import logic from 'assets/json/tasting/logic.json';

const isScholarView = (tastingType) => {
	return (
		tastingType === 'scholar2' ||
		tastingType === 'scholar2m' ||
		tastingType === 'scholar3' ||
		tastingType === 'scholar3m' ||
		tastingType === 'scholar4' ||
		tastingType === 'scholar4m'
	);
};

export default function filterByLogic(step, data, selectedItems, tastingType) {
	let selections = data.selections;

	// Whitelist filterable steps
	if (tastingType && !isScholarView(tastingType) && (step === 'nose' || step === 'palate')) {
		selections.forEach((selection) => {
			selection.hiddenOptions = [];

			// Handle logic for  "ONLYIF"
			if (logic[selection.key] && 'onlyif' in logic[selection.key]) {
				let showItem = false;
				if (selectedItems['appearance']) {
					Object.keys(selectedItems['appearance']).forEach((key) => {
						let selectedValue = selectedItems['appearance'][key];
						if (logic[selection.key]['onlyif'].includes(selectedValue)) {
							showItem = true;
						}
					});

					if (showItem) {
						selection.hideSelection = false;
					} else {
						Object.keys(selectedItems).forEach((key) => {
							if (selection.key in selectedItems[key]) {
								delete selectedItems[step][selection.key];
								selection.activeOption = null;
								selection.isActive = false;

								if (data.activeSelection.key === selection.key) {
									data.activeSelection = selections[0];
									data.activeSelection.isActive = true;
								}
							}
						});

						if (isScholarView(tastingType)) {
							return (selection.hideSelection = false);
						}

						selection.hideSelection = true;
					}
				}
			}

			// Handle logic for  "NOTIF" (selections)
			if (logic[selection.key] && 'notif' in logic[selection.key]) {
				let showItem = true;

				if (selectedItems['appearance']) {
					Object.keys(selectedItems['appearance']).forEach((key) => {
						let selectedValue = selectedItems['appearance'][key];
						if (logic[selection.key]['notif'].includes(selectedValue)) {
							showItem = false;
						}
					});

					if (!showItem) {
						Object.keys(selectedItems).forEach((key) => {
							if (selection.key in selectedItems[key]) {
								delete selectedItems[step][selection.key];
								selection.activeOption = null;
								selection.isActive = false;

								if (data.activeSelection.key === selection.key) {
									data.activeSelection = selections[0];
									data.activeSelection.isActive = true;
								}
							}
						});
						selection.hideSelection = true;
					} else {
						selection.hideSelection = false;
					}
				}
			}

			selection.options.forEach((option, index) => {
				// Handle logic for  "ONLYIF" (selection options)
				if (logic[option] && 'onlyif' in logic[option]) {
					let showOption = false;

					selectedItems['appearance'] &&
						Object.keys(selectedItems['appearance']).forEach((key) => {
							let selectedValue = selectedItems['appearance'][key];
							if (logic[option]['onlyif'].includes(selectedValue)) {
								showOption = true;
							}
						});

					if (showOption) {
						if (selection.hiddenOptions.includes(option)) {
							selection.hiddenOptions.splice(index, 1);
						}
					} else {
						if (!selection.hiddenOptions.includes(option)) {
							selection.hiddenOptions.push(option);
						}

						selectedItems[step] &&
							Object.keys(selectedItems[step]).forEach((key) => {
								let val = selectedItems[step][key];
								if (Object.prototype.toString.call(val) === '[object Array]') {
									if (val.includes(option)) {
										val.splice(val.indexOf(option), 1);
									}
								} else {
									if (val === option) {
										selectedItems[step][key] = null;
									}
								}
							});
					}

					// update data of active selection
					if (data.activeSelection.key === selection.key) {
						data.activeSelection = {...selection};
					}
				}

				// Handle logic for  "NOTIF" (selection options)
				if (logic[option] && 'notif' in logic[option]) {
					let showOption = true;

					selectedItems['appearance'] &&
						Object.keys(selectedItems['appearance']).forEach((key) => {
							let selectedValue = selectedItems['appearance'][key];
							if (logic[option]['notif'].includes(selectedValue)) {
								if (!selection.hiddenOptions.includes(option)) {
									showOption = false;
								}
							}
						});

					if (showOption) {
						if (selection.hiddenOptions.includes(option)) {
							selection.hiddenOptions.splice(index, 1);
						}
					} else {
						if (!selection.hiddenOptions.includes(option)) {
							selection.hiddenOptions.push(option);
						}

						selectedItems[step] &&
							Object.keys(selectedItems[step]).forEach((key) => {
								let val = selectedItems[step][key];
								if (Object.prototype.toString.call(val) === '[object Array]') {
									if (val.includes(option)) {
										val.splice(val.indexOf(option), 1);
									}
								} else {
									if (val === option) {
										selectedItems[step][key] = null;
									}
								}
							});
					}

					// update data of active selection
					if (data.activeSelection.key === selection.key) {
						data.activeSelection = {...selection};
					}
				}
			});
		});
	}
}
