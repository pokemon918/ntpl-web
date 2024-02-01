const {uiBot} = require('./uiBot/uiBot');

before(async () => {
	await uiBot.start();
});

after(async () => {
	await uiBot.stop();
});
