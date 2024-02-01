import profound from '../support/tests/smoke/profound';
import profoundM from '../support/tests/smoke/profoundMobile';
import quick_fortified from '../support/tests/smoke/quick_fortified';
import quick_sparkling from '../support/tests/smoke/quick_sparkling';
import quick_still from '../support/tests/smoke/quick_still';
import scholar2m from '../support/tests/smoke/scholar2Mobile';

afterEach(function () {
	if (this.currentTest.state === 'failed') {
		Cypress.runner.stop();
	}
});

profound();
profoundM();
quick_fortified();
quick_sparkling();
quick_still();
scholar2m();
