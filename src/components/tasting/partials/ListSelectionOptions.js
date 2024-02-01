import React, {Component} from 'react';
import SingleSelectorItem from 'components/shared/ui/SingleSelector/SingleSelectorItem';
import MultiSelector from 'components/shared/ui/MultiSelector';
import L18nText from 'components/shared/L18nText';
import Grid from 'components/shared/ui/Grid';
import {isScholarView} from 'components/tasting/common';
import {tastingsConstants} from 'const';

import './ListSelectionOptions.scss';

const COLOR_SELECTORS = ['color_', 'nuance_'];

const selectedColor = {
	nuance_pinkorange: 'Rosé',
	nuance_lemongreen: 'White',
	nuance_lemon: 'White',
	nuance_gold: 'White',
	nuance_amber: 'White',
	nuance_brown: 'White',
	nuance_pink: 'Rosé',
	nuance_salmon: 'Rosé',
	nuance_orange: 'Rosé',
	nuance_purple: 'Red',
	nuance_ruby: 'Red',
	nuance_garnet: 'Red',
	nuance_tawny: 'Red',
	nuance_brown_red: 'Red',
};

const scholar3 = ['scholar3', 'scholar3m'];

const selectedType = {
	color_: 'color',
	sherrytype_: 'color',
	winetype_: 'winetype',
	nuance_: 'color',
	nuance_tint_: 'color',
	clarity__: 'color',
	colorintensity__: 'color',
};

const getFortifiedAlcoholLevel = {
	alcohol_high: 'alcohol_fortified_high_description',
	alcohol_medium: 'alcohol_fortified_medium_description',
	alcohol_low: 'alcohol_fortified_low_description',
};

const getAlcoholLevel = {
	alcohol_high: 'alcohol_general_high_description',
	alcohol_medium: 'alcohol_general_medium_description',
	alcohol_low: 'alcohol_general_low_description',
};

const getDescription = (key, multiStepForm, option) => {
	let description = '';

	if (scholar3.includes(multiStepForm.tastingType)) {
		if (option === 'readiness_suitableforbottleageing') {
			return 'quality_drink_description';
		}

		if (option === 'readiness_notsuitableforbottleageing') {
			return 'quality_ageing_description';
		}

		if (key === 'clarity__' && option === 'clarity_hazy') {
			return 'subHeader_faulty';
		}

		if (key === 'condition__' && option === 'condition_unclean') {
			return 'subHeader_faulty';
		}
	}

	if (
		key !== 'alcohol__' ||
		multiStepForm.tastingType !== 'quick' ||
		(multiStepForm.selectedItems && !multiStepForm.selectedItems.appearance)
	) {
		return description;
	}

	if (
		(multiStepForm.selectedItems.appearance.winetype_ &&
			multiStepForm.selectedItems.appearance.winetype_ === 'category_still') ||
		multiStepForm.selectedItems.appearance.winetype_ === 'category_sparkling'
	) {
		description = getAlcoholLevel[option];
	}

	if (
		(multiStepForm.selectedItems.appearance.winetype_ &&
			multiStepForm.selectedItems.appearance.winetype_ === 'type_sherry_') ||
		multiStepForm.selectedItems.appearance.winetype_ === 'type_port'
	) {
		description = getFortifiedAlcoholLevel[option];
	}

	return description;
};

function singleSelectionLogic(selectedItems, activeSelection) {
	return function filterDisplayedItems(item) {
		if (activeSelection.key === 'color_') {
			const {winetype_} = selectedItems.appearance;
			const hiddenColors = tastingsConstants.COLORS_HIDDEN_PER_WINETYPE[winetype_];
			if (hiddenColors) {
				return !hiddenColors.includes(item);
			}
		}
		return true;
	};
}

export default class ListSelectionOptions extends Component {
	render() {
		const {
			activeSelection,
			multiple,
			isLastSelection,
			multiStepForm,
			multiStepForm: {selectedItems, tastingType},
			getIsChecked,
		} = this.props;

		const multiSelectorOptions =
			activeSelection && activeSelection.options
				? activeSelection.options
						.filter(
							(item) =>
								!activeSelection.hiddenOptions || !activeSelection.hiddenOptions.includes(item)
						)
						.map((item) => {
							let isChecked = false;
							if (
								multiple &&
								activeSelection.activeOption &&
								Array.isArray(activeSelection.activeOption) &&
								activeSelection.activeOption.forEach((selectedItem) => {
									if (selectedItem === item) {
										isChecked = true;
									}
								})
							);

							return {
								name: item,
								id: item,
								isActive: isChecked,
							};
						})
				: [];

		const activeSelectionOptions =
			activeSelection && !multiple ? (
				activeSelection.options
					.filter(singleSelectionLogic(selectedItems, activeSelection))
					.map((option, index) => {
						// Skip option if in hiddenOptions
						if (activeSelection?.hiddenOptions?.includes(option)) {
							return null;
						}

						let isChecked = false;

						if (activeSelection.activeOption && activeSelection.activeOption === option) {
							isChecked = true;
						}
						let description = '';
						description = getDescription(activeSelection.key, multiStepForm, option);

						let activeColor = '';
						if (
							activeSelection.key === 'clarity__' ||
							(activeSelection.key === 'colorintensity__' && selectedItems)
						) {
							activeColor = selectedItems.appearance && `${selectedItems.appearance.nuance_tint_}`;
						}

						const updateDescription =
							isScholarView(tastingType) &&
							activeSelection.key === 'color_' &&
							selectedColor[option];

						const itemType =
							isScholarView(tastingType) && !COLOR_SELECTORS.includes(activeSelection.key)
								? 'default'
								: selectedType[activeSelection.key];

						return (
							<div className="selector-wrapper" key={index}>
								<Grid columns={4}>
									<L18nText id={option} defaultMessage={option}>
										{(translatedOption) => (
											<SingleSelectorItem
												type={itemType || 'default'}
												key={option}
												id={option}
												activeColor={activeColor}
												description={description}
												subTitle={updateDescription}
												isActive={isChecked}
												activeSelection={activeSelection}
												hideArrow={isLastSelection}
												onSelect={() => this.props.handleOptionSelect(option)}
												name={translatedOption}
											/>
										)}
									</L18nText>
								</Grid>
							</div>
						);
					})
			) : (
				<MultiSelector
					type={tastingType}
					selectionKey={activeSelection && activeSelection.key}
					notes={multiSelectorOptions}
					onHandleSelect={this.props.handleOptionSelect}
					getIsChecked={getIsChecked}
				/>
			);

		return (
			<ul className="list-group list-options">
				{activeSelectionOptions}
				{this.renderBasedFromMessage()}
			</ul>
		);
	}

	renderBasedFromMessage() {
		const {
			activeSelection,
			multiple,
			multiStepForm: {tastingSrc},
		} = this.props;

		const match = activeSelection && !multiple && activeSelection.options.length === 0;
		if (!match) {
			return null;
		}

		const basedFrom = tastingSrc[`${activeSelection.key}_based_from`];
		if (!basedFrom) {
			return null;
		}

		return (
			<div className="ListSelectionOptions__SelectBasedFromFirst">
				<L18nText
					id="tasting_select_based_from_first"
					values={{
						based_from: (
							<strong>
								<L18nText id={basedFrom} />
							</strong>
						),
					}}
				/>
			</div>
		);
	}
}
