import React, {FC} from 'react';

import {FormLabel} from 'components/shared/ui';

interface Props {
	name: string;
}

const FormEventWineList: FC<Props> = ({name}) => (
	<FormLabel label="event_field_wine_list">
		<div>-</div>
	</FormLabel>
);

export default FormEventWineList;
