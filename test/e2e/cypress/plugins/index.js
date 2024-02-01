// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
	require('cypress-plugin-retries/lib/plugin')(on);
	// `on` is used to hook into various events Cypress emits
	// `config` is the resolved Cypress config
	const userName = 'test_e2e_user';
	const userEmail = 'cits@ntbl.link';
	const userPassword = '1234';

	const tastingInfo = {
		tasting_country: 'testCountry',
		tasting_region: 'tastingRegion',
		tasting_producer: 'tastingProducer',
		tasting_name: 'tastingName',
		tasting_grape: 'tastingGrape',
		tasting_vintage: 2019,
	};
	// modify env var value
	config.env.userName = userName;
	config.env.userEmail = userEmail;
	config.env.userPassword = userPassword;
	config.env.tastingInfo = JSON.stringify(tastingInfo);
	config.baseUrl = config.env.APP_URL || 'http://localhost:3000';

	// return config
	return config;
};
