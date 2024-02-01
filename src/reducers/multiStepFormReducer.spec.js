import {multiStepFormConstants} from 'const';
import multiStepFormReducer from './multiStepFormReducer';

describe('multiStepFormReducer', () => {
	it('Sould copy aroma notes in desktop profound tasting', () => {
		const state = {
			steps: {
				nose: {
					subSteps: {
						step2: {
							data: {
								selections: [
									{
										key: 'notes_floral_',
										activeOption: ['note_acacia', 'note_chamomile', 'note_rose', 'note_violet'],
									},
									{
										key: 'notes_fruit_green_',
										activeOption: ['note_apple', 'note_pear', 'note_grape'],
									},
								],
							},
						},
					},
				},
				palate: {
					subSteps: {
						step2: {
							data: {
								selections: [
									{
										key: 'notes_floral_',
										activeOption: null,
									},
									{
										key: 'notes_fruit_green_',
										activeOption: null,
									},
								],
							},
						},
					},
				},
			},
		};
		const action = {
			type: multiStepFormConstants.COPY_AROMA_NOTES,
			payload: {
				aromaNotes: {
					notes_floral_: ['note_acacia', 'note_chamomile', 'note_rose', 'note_violet'],
					notes_fruit_green_: ['note_apple', 'note_pear', 'note_grape'],
				},
				step: 'palate',
				name: 'step2',
				tastingType: 'profound',
			},
		};
		const nextState = multiStepFormReducer(state, action);
		expect(nextState.copiedNotes).toBe(true);

		const palateSelections = nextState.steps.palate.subSteps.step2.data.selections;
		expect(palateSelections.find((i) => i.key === 'notes_floral_').activeOption).toEqual([
			'note_acacia',
			'note_chamomile',
			'note_rose',
			'note_violet',
		]);
		expect(palateSelections.find((i) => i.key === 'notes_fruit_green_').activeOption).toEqual([
			'note_apple',
			'note_pear',
			'note_grape',
		]);
		expect(nextState.selectedItems.palate.notes_floral_).toEqual([
			'note_acacia',
			'note_chamomile',
			'note_rose',
			'note_violet',
		]);
		expect(nextState.selectedItems.palate.notes_fruit_green_).toEqual([
			'note_apple',
			'note_pear',
			'note_grape',
		]);
	});

	it('Should copy aromas notes in mobile profound tasting', () => {
		const state = {
			steps: {
				nose: {
					subSteps: {
						step4: {
							data: {
								selections: [
									{
										key: 'notes_floral_',
										activeOption: ['note_acacia', 'note_chamomile', 'note_rose', 'note_violet'],
									},
								],
							},
						},
						step5: {
							data: {
								selections: [
									{
										key: 'notes_fruit_green_',
										activeOption: ['note_apple', 'note_pear', 'note_grape'],
									},
								],
							},
						},
					},
				},
				palate: {
					subSteps: {
						step8: {
							data: {
								selections: [
									{
										key: 'notes_floral_',
										activeOption: null,
									},
								],
							},
						},
						step9: {
							data: {
								selections: [
									{
										key: 'notes_fruit_green_',
										activeOption: null,
									},
								],
							},
						},
					},
				},
			},
		};
		const action = {
			type: 'COPY_AROMA_NOTES',
			payload: {
				aromaNotes: {
					notes_floral_: ['note_acacia', 'note_chamomile', 'note_rose', 'note_violet'],
					notes_fruit_green_: ['note_apple', 'note_pear', 'note_grape'],
				},
				step: 'palate',
				name: 'step8',
				tastingType: 'profoundMobile',
			},
		};
		const nextState = multiStepFormReducer(state, action);
		expect(nextState.copiedNotes).toBe(true);

		const palateFloral = nextState.steps.palate.subSteps.step8.data.selections;
		expect(palateFloral.find((i) => i.key === 'notes_floral_').activeOption).toEqual([
			'note_acacia',
			'note_chamomile',
			'note_rose',
			'note_violet',
		]);
		const palateGreenFruit = nextState.steps.palate.subSteps.step9.data.selections;
		expect(palateGreenFruit.find((i) => i.key === 'notes_fruit_green_').activeOption).toEqual([
			'note_apple',
			'note_pear',
			'note_grape',
		]);
		expect(nextState.selectedItems.palate.notes_floral_).toEqual([
			'note_acacia',
			'note_chamomile',
			'note_rose',
			'note_violet',
		]);
		expect(nextState.selectedItems.palate.notes_fruit_green_).toEqual([
			'note_apple',
			'note_pear',
			'note_grape',
		]);
	});
});
