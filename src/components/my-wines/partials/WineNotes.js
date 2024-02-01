import React, {Fragment} from 'react';

import L18nText from 'components/shared/L18nText';

const WineNotes = ({notes}) => (
	<span>
		{!notes.length
			? '-'
			: notes
					.filter((note) => note)
					.map((note, index) => (
						<Fragment key={note}>
							{index > 0 ? ', ' : ''}
							<L18nText id={note} defaultMessage="None" />
						</Fragment>
					))}
	</span>
);

export default WineNotes;
