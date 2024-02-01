const menu = require('./upgrades/navbar');
const setCoreUrl = require('./upgrades/setCoreUrl');

module.exports = function (uiBot) {
	console.log('Upgrading uiBot memory');
	menu(uiBot);
	setCoreUrl(uiBot);
};
