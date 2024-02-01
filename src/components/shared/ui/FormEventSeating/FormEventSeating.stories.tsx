import React from 'react';

import {FormDecorator} from 'stories/decorators';
import {FormEventSeating} from 'components/shared/ui';

export default {
	title: 'UI Kit / Forms / Form Event Seating',
	decorators: [FormDecorator],
};

export const normal = () => <FormEventSeating name="seats" />;
