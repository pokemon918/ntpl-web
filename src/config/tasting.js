import quick from 'assets/json/tasting/quick/quick.json';
import swa20 from 'assets/json/tasting/swa20/swa20.json';
// scholar
import scholar2 from 'assets/json/tasting/scholar2/scholar2.json';
import scholar3 from 'assets/json/tasting/scholar3/scholar3.json';
import scholar4 from 'assets/json/tasting/scholar4/scholar4.json';
// Profound imports
import profound from 'assets/json/tasting/level3.json';
import p_appearance from 'assets/json/tasting/profound/appearance.json';
import p_nose from 'assets/json/tasting/profound/nose.json';
import p_palate from 'assets/json/tasting/profound/palate.json';

// Light imports
import light from 'assets/json/tasting/light.json';
import l_appearance from 'assets/json/tasting/light/appearance.json';
import l_nose from 'assets/json/tasting/light/nose.json';
import l_palate from 'assets/json/tasting/light/palate.json';

const tasting = {
	data: {
		profound: {
			appearance: p_appearance,
			nose: p_nose,
			palate: p_palate,
		},
		light: {
			appearance: l_appearance,
			nose: l_nose,
			palate: l_palate,
		},
		nectar: {
			appearance: p_appearance,
			nose: p_nose,
			palate: p_palate,
		},
	},
	source: {
		quick: quick,
		swa20,
		scholar2: scholar2,
		scholar2m: scholar2,
		scholar3: scholar3,
		scholar3m: scholar3,
		scholar4: scholar4,
		scholar4m: scholar4,
		profound: profound,
		profoundMobile: profound,
		light: light,
		nectar: profound,
	},
};

export default tasting;
