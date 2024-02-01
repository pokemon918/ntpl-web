import {addPrefix} from './utils';

import characteristic from './flex/en/characteristic';
import team from './flex/en/team';
import colors from './flex/en/colors';
import events from './flex/en/events';
import general from './flex/en/general';
import notes from './flex/en/notes';
import rating from './flex/en/rating';
import contest from './flex/en/contest';
import settings from './flex/en/settings';
import shared from './flex/en/shared';
import tasting from './flex/en/tasting';
import wine from './flex/en/wine';
import currency from './flex/en/currency';
import auth from './flex/en/auth';
import start from './flex/en/start';
import error from './flex/en/error';
import subscription from './flex/en/subscription';
import country from './static/country/en';
import name from './static/name/en';

export default {
	...auth,
	...contest,
	...subscription,
	...characteristic,
	...team,
	...colors,
	...error,
	...events,
	...currency,
	...general,
	...notes,
	...rating,
	...settings,
	...shared,
	...tasting,
	...wine,
	...start,
	...addPrefix('country').to(country),
	...addPrefix('name').to(name),
};
