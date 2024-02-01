import tastingSetups from 'components/tasting/setup';

import {getGeneralNotes} from './helpers';
import {ImpressionData, TastingSteps, TastingSubSteps, TastingStepSelection} from './types';

export function getStepsFromImpression(data: ImpressionData): TastingSteps {
	const {source} = data;
	const getTastingSetup = tastingSetups[source];

	if (!getTastingSetup) {
		return {};
	}

	const notes = getGeneralNotes(data.notes);
	const wineType = notes.find((i) => i.startsWith('category_') || i.startsWith('type_'));
	const wineColor = notes.find((i) => i.startsWith('nuance_') || i.startsWith('color_'));
	const tastingSetup = getTastingSetup({wineType, wineColor});
	const {tastingSrc, steps: serializerSteps} = tastingSetup;

	if (!data || !tastingSrc || !serializerSteps) {
		return {};
	}

	const steps: TastingSteps = {};

	for (const key of Object.keys(serializerSteps)) {
		const data = serializerSteps[key];

		// only substeps are supported
		const isSubStep = Array.isArray(data);
		if (!isSubStep) {
			continue;
		}

		const subStepConfigs = [data].flat();
		const subSteps: TastingSubSteps = {};

		for (const subStepData of subStepConfigs) {
			const {keys, isMultiple} = subStepData;
			const selections: TastingStepSelection[] = [];

			for (const selectionKey of keys) {
				const options = tastingSrc[selectionKey];
				const isOption = (i: string) => options.includes(i);
				const filterMultiple = () => notes.filter(isOption);
				const findSingle = () => notes.find(isOption) || '';
				const activeOption = isMultiple ? filterMultiple() : findSingle();

				const selectionData: TastingStepSelection = {
					key: selectionKey,
					activeOption,
					options,
					hideSelection: false,
					isActive: true,
				};

				if (isMultiple) {
					selectionData.hiddenOptions = [];
				}

				selections.push(selectionData);
			}

			const [firstSelection] = selections;
			const activeSelection = {...firstSelection};
			delete activeSelection.hideSelection;

			const nextIndex = Object.keys(subSteps).length + 1;
			const stepIndex = `step${nextIndex}`;
			subSteps[stepIndex] = {data: {activeSelection, selections}};
		}

		steps[key] = {
			subSteps,
			isSubStep: true,
		};
	}

	return steps;
}
