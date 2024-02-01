import React from 'react';
import Back from './Back';

const PageUnavailable = () => (
	<div>
		<Back />
		<br />
		<h4 className="title">Sorry the requested page is unavailable. Please try again later</h4>
	</div>
);

export default PageUnavailable;
