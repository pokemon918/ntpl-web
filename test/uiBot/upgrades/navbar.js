const log = require('../log');

module.exports = function (uiBot) {
	uiBot.navbar = async function (url) {
		log('navibar', url);
		log.level++;
		await uiBot.click('.navbar-brand');
		await uiBot.click(`#AppSideNav > div > a[href="${url}"]`);
		log.level--;
	};
};
