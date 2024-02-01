import tasting from 'config/tasting';
import {getStepsFromImpression} from './index';

import impressionData from './fixtures/impressionData.json';
import expectedSteps from './fixtures/expectedSteps.json';

describe('getStepsFromImpression', () => {
	it('Should convert steps from impression data', () => {
		const steps = getStepsFromImpression(impressionData);
		expect(steps).toEqual(expectedSteps);
	});
});
