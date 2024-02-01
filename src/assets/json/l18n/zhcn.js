import {addPrefix} from './utils';

import characteristic from './flex/zhcn/characteristic';
import team from './flex/zhcn/team';
import colors from './flex/zhcn/colors';
import events from './flex/zhcn/events';
import general from './flex/zhcn/general';
import notes from './flex/zhcn/notes';
import rating from './flex/zhcn/rating';
import settings from './flex/zhcn/settings';
import shared from './flex/zhcn/shared';
import tasting from './flex/zhcn/tasting';
import wine from './flex/zhcn/wine';
import auth from './flex/zhcn/auth';
import start from './flex/zhcn/start';
import error from './flex/zhcn/error';
import subscription from './flex/zhcn/subscription';
import country_base from './static/country/en';
import name_base from './static/name/en';
import country from './static/country/zhcn';
import name from './static/name/zhcn';

export default {
	...auth,
	...subscription,
	...characteristic,
	...team,
	...colors,
	...error,
	...events,
	...general,
	...notes,
	...rating,
	...settings,
	...shared,
	...tasting,
	...wine,
	...start,
	...addPrefix('country').to(country_base),
	...addPrefix('name').to(name_base),
	...addPrefix('country').to(country),
	...addPrefix('name').to(name),
};
