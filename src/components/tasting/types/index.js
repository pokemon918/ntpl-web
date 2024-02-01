import Light from './Light';
import Nectar from './Nectar';
import Profound from './Profound';
import ProfoundMobile from './ProfoundMobile';
import Quick from './Quick';
import SWA20 from './SWA20';
import Scholar2 from './Scholar2';
import Scholar2Mobile from './Scholar2Mobile';
import Scholar3 from './Scholar3';
import Scholar3Mobile from './Scholar3Mobile';
import Scholar4 from './Scholar4';
import Scholar4Mobile from './Scholar4Mobile';

const tastingTypes = {
	Quick,
	Light,
	Nectar,
	Profound,
	ProfoundMobile,
	SWA20,
	Scholar2,
	Scholar2Mobile,
	Scholar3,
	Scholar3Mobile,
	Scholar4,
	Scholar4Mobile,
};

export function getTastingComponent(type) {
	const supportedTastings = {
		nectar: Nectar,
		quick: Quick,
		swa20: SWA20,
		profound: Profound,
		profoundMobile: ProfoundMobile,
		light: Light,
		scholar2: Scholar2,
		scholar2m: Scholar2Mobile,
		scholar3: Scholar3,
		scholar3m: Scholar3Mobile,
		scholar4: Scholar4,
		scholar4m: Scholar4Mobile,
	};
	return supportedTastings[type];
}

export default tastingTypes;
