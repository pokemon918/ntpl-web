// short for dataclick
export function click(dataTestKey, force = 0) {
	cy.get(`[data-test=${dataTestKey}]`).click({force: !!force});
}

export function clicks(dataTestKeys) {
	Array.prototype.slice
		.call(arguments)
		.flat()
		.forEach((e) => click(e));
}

export function contains(...severalElements) {
	severalElements.forEach((element) => {
		cy.contains(element);
	});
}

export function notContains(...severalElements) {
	severalElements.forEach((element) => {
		cy.contains(element).should('not.exist');
	});
}

export function clickNext(times = 1) {
	[...Array(times).keys()].forEach(() => cy.get('[data-test=nextBtn] button').click({force: true}));
}

export function clickBack(times = 1) {
	[...Array(times).keys()].forEach(() => cy.get('[data-test=prevBtn] button').click({force: true}));
}

export function startFromMyTasting() {
	cy.changeUrl('/tastings').get('[data-test=wine_tasting_list_title]');

	/*
	cy.get('.SiteHeader_Hamburger').click();
	cy.get('[data-test=nav_myTasting]')
		.first()
		.click();
	*/
}

export function startFromNewTasting() {
	cy.changeUrl('/tasting').get('[data-test=tasting_choose_title]');

	/*
	cy.get('.SiteHeader_Hamburger').click();
	cy.get('[data-test=nav_newTasting]')
		.first()
		.click();
	*/
}

export const tastingInfo = JSON.parse(Cypress.env('tastingInfo'));

export const uniqueName = `${tastingInfo.tasting_name}_${new Date().toISOString()}`;
