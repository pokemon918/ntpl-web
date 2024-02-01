import React from 'react';

import {FormDecorator} from 'stories/decorators';
import {FormEventPrice} from 'components/shared/ui';

export default {
	title: 'UI Kit / Forms / Form Event Price',
	decorators: [FormDecorator],
};

export const normal = () => <FormEventPrice name="price" />;
