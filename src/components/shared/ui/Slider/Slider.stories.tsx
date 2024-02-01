import React, {useState} from 'react';

import Slider from './index';

export default {
	title: 'UI Kit / Inputs / Slider',
	component: Slider,
};

export const Normal = () => {
	const [value, setValue] = useState<number | null>(null);

	return (
		<Slider
			title="Sweetness"
			minimum={0}
			maximum={10}
			current={value}
			initialValueChanged={value !== null}
			onChange={(newValue: number) => setValue(newValue)}
		/>
	);
};
