import filterByLogic from './filterByLogic';

// mock the logic config because we only want to test the filter logic here
// changes to the configuration shouldn't affect these unit tests
jest.mock('assets/json/tasting/logic.json', () => ({
	// tomato leaf should be displayed to all wine colours but white
	note_tomato_leaf: {
		notif: ['nuance_white'],
	},
	// whitish leaf should be displayed only to white wine
	note_whitish_leaf: {
		onlyif: ['nuance_white'],
	},
}));

const setup = ({color_}) => ({
	step: 'nose',
	data: {
		selections: [
			{
				key: 'notes_herbaceous_',
				options: ['note_grass', 'note_tomato_leaf', 'note_whitish_leaf'],
				hiddenOptions: [],
			},
			{
				key: 'notes_floral_',
				options: ['note_acacia', 'note_chamomile', 'note_rose'],
				hiddenOptions: [],
			},
			{
				key: 'notes_fruit_green_',
				options: ['note_apple', 'note_pear', 'note_grape'],
				hiddenOptions: [],
			},
		],
		activeSelection: {
			key: 'notes_herbaceous_',
			options: ['note_grass', 'note_tomato_leaf', 'note_whitish_leaf'],
			hiddenOptions: [],
		},
	},
	selectedItems: {
		appearance: {
			color_,
		},
		nose: {},
	},
});

describe('filterByLogic', () => {
	describe('notif logic', () => {
		test.skip('Should hide tomato leaf from white wine', () => {
			const {step, data, selectedItems} = setup({color_: 'nuance_white'});
			filterByLogic(step, data, selectedItems);

			const [firstSelection] = data.selections;
			expect(firstSelection.key).toBe('notes_herbaceous_');
			expect(firstSelection.hiddenOptions).toContain('note_tomato_leaf');

			const {activeSelection} = data;
			expect(activeSelection.key).toBe('notes_herbaceous_');
			expect(activeSelection.hiddenOptions).toContain('note_tomato_leaf');
		});

		it('Should display tomato leaf to rosé wine', () => {
			const {step, data, selectedItems} = setup({color_: 'nuance_rose'});
			filterByLogic(step, data, selectedItems);

			const [firstSelection] = data.selections;
			expect(firstSelection.key).toBe('notes_herbaceous_');
			expect(firstSelection.hiddenOptions).not.toContain('note_tomato_leaf');

			const {activeSelection} = data;
			expect(activeSelection.key).toBe('notes_herbaceous_');
			expect(activeSelection.hiddenOptions).not.toContain('note_tomato_leaf');
		});

		test.skip('Should hide green apple to red wine', () => {
			const {step, data, selectedItems} = setup({color_: 'nuance_red'});
			filterByLogic(step, data, selectedItems);

			const greenFruitGroup = data.selections.find(
				(selection) => selection.key === 'notes_fruit_green_'
			);
			expect(greenFruitGroup.hiddenOptions).toContain('note_apple');
			expect(greenFruitGroup.options).not.toContain('note_apple');
		});

		test.skip('Should hide chamomile to red wine', () => {
			const {step, data, selectedItems} = setup({color_: 'nuance_red'});
			filterByLogic(step, data, selectedItems);

			const floralGroup = data.selections.find((selection) => selection.key === 'notes_floral_');
			expect(floralGroup.hiddenOptions).toContain('note_chamomile');
			expect(floralGroup.options).not.toContain('note_chamomile');
		});

		test.skip('Should display chamomile when changing from red to white wine', () => {
			const {step, data, selectedItems} = setup({color_: 'nuance_red'});
			filterByLogic(step, data, selectedItems);

			const floralGroup = data.selections.find((selection) => selection.key === 'notes_floral_');
			expect(floralGroup.hiddenOptions).toContain('note_chamomile');
			expect(floralGroup.options).not.toContain('note_chamomile');

			selectedItems.appearance.color_ = 'nuance_white';
			filterByLogic(step, data, selectedItems);

			expect(floralGroup.hiddenOptions).not.toContain('note_chamomile');
			expect(floralGroup.options).toContain('note_chamomile');
		});
	});

	describe('onlyif logic', () => {
		test.skip('Should hide whitish leaf from rosé wine', () => {
			const {step, data, selectedItems} = setup({color_: 'nuance_rose'});
			filterByLogic(step, data, selectedItems);

			const [firstSelection] = data.selections;
			expect(firstSelection.key).toBe('notes_herbaceous_');
			expect(firstSelection.hiddenOptions).toContain('note_whitish_leaf');

			const {activeSelection} = data;
			expect(activeSelection.key).toBe('notes_herbaceous_');
			expect(activeSelection.hiddenOptions).toContain('note_whitish_leaf');
		});

		it('Should display whitish leaf to white wine', () => {
			const {step, data, selectedItems} = setup({color_: 'nuance_white'});
			filterByLogic(step, data, selectedItems);

			const [firstSelection] = data.selections;
			expect(firstSelection.key).toBe('notes_herbaceous_');
			expect(firstSelection.hiddenOptions).not.toContain('note_whitish_leaf');

			const {activeSelection} = data;
			expect(activeSelection.key).toBe('notes_herbaceous_');
			expect(activeSelection.hiddenOptions).not.toContain('note_whitish_leaf');
		});
	});
});
