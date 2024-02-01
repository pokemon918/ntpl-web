import {clicks} from './include';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('signUp', (email) => {
	cy.server(); // todo: find out if this is needed
	cy.route('GET', '/sockjs-node/**', {}).as('getSockJs');
	cy.route('POST', 'https://sessions.bugsnag.com/', {}).as('bugsnag');
	cy.route('GET', '/user/plan**').as('userPlan');

	cy.visit('/sign-up' + '?api=' + Cypress.env('API_URL'));

	cy.get('[data-test=registration-title]');

	clicks('title', 'selecting__1');

	cy.get('[data-test=name]').type(Cypress.env('userName'));
	cy.get('[data-test=email]').type(email);
	cy.get('[data-test=password]').type(Cypress.env('userPassword'));
	cy.get('[data-test=confirmPassword]').type(Cypress.env('userPassword'));
	cy.get('[data-test=voucher]').type(Cypress.env('userVoucher'));
	cy.get('[data-test=confirmReg]').click();
	cy.get('[data-test=reg-submit]').click();
	cy.get('[data-test=getStartLink]').click();
});

Cypress.Commands.add('login', (email, forceLogout = true) => {
	if (!email && !!DEFAULT_LOGIN_STATE) {
		LOCAL_STORAGE = DEFAULT_LOGIN_STATE;
		return cy.restoreLoginState();
	}

	let loginEmail = email || Cypress.env('userEmail');
	cy.route('GET', '/sockjs-node/**', {}).as('getSockJs');
	cy.route({url: '/wp-json/**', force404: true}).as('wp-menu');
	cy.route('POST', 'https://sessions.bugsnag.com/', {}).as('bugsnag');
	cy.route('GET', '/user/plan**').as('userPlan');

	//cy.visit(`/`);
	//cy.window().then((win) => {
	//	win.localStorage.clear();
	//});

	// Make sure user is logged out
	if (forceLogout) {
		cy.visit(`/app/reset`).location('pathname').should('include', '/sign');
	}

	// Set backend API
	cy.visit(`/sign-in?api=${Cypress.env('API_URL')}`);

	// Do login
	cy.get('[data-test=email]').type(loginEmail);
	cy.get('[data-test=password]').type(Cypress.env('userPassword'));
	cy.get('[data-test=login_submit]').click();

	// Login OK
	cy.get('.SiteHeader_UserInfo_Icon', {timeout: 20000});
	//cy.saveLogin()

	// Make sure we got all the data
	cy.wait('@userPlan');

	cy.saveLocalStorage().setDetaultLoginState();
});

Cypress.Commands.add('changeUrl', (url = '') => {
	return cy.window().invoke('gotoUrl', url); // In our app we let the history.push be bound to window.gotoUrl
});

let LOCAL_STORAGE = {};

let DEFAULT_LOGIN_STATE = false;

Cypress.Commands.add('setDetaultLoginState', () => {
	DEFAULT_LOGIN_STATE = LOCAL_STORAGE;
});

Cypress.Commands.add('saveLogin', () => {
	LOCAL_STORAGE['mem'] = localStorage['mem'];
});

Cypress.Commands.add('reLogin', () => {
	localStorage.setItem('mem', LOCAL_STORAGE['mem'] || null);
});

Cypress.Commands.add('saveLocalStorage', () => {
	Object.keys(localStorage).forEach((key) => {
		LOCAL_STORAGE[key] = localStorage[key];
	});
});

Cypress.Commands.add('restoreLoginState', () => {
	Object.keys(LOCAL_STORAGE).forEach((key) => {
		localStorage.setItem(key, LOCAL_STORAGE[key]);
	});
});

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
