import basic from '../support/tests/access/subscription_basic';
import pro from '../support/tests/access/subscription_pro';
import scholar from '../support/tests/access/subscription_scholar';
import view from '../support/tests/access/subscription_view';

afterEach(function () {
	if (this.currentTest.state === 'failed') {
		Cypress.runner.stop();
	}
});

basic();
pro();
scholar();
view();
