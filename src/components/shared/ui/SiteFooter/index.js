import React from 'react';

import noteableLogo from 'assets/images/noteable_logo.svg';
import './SiteFooter.scss';

const SiteFooter = () => (
	<div className="SiteFooter__Container">
		<div>
			<img src={noteableLogo} alt="logo" width="auto" height="28" />
		</div>
		<div>
			<br />
			<span>NoteAble</span> <br />
			<span>Sturlasgade 12B</span> <br />
			<span>DK - 2300 Copenhagen S</span> <br />
			<br />
			<span>Phone: +45 28 34 20 29</span> <br />
			<span>hello@noteable.co</span> <br />
		</div>
	</div>
);

export default SiteFooter;
