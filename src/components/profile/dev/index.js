import React from 'react';

import Advanced from './Advanced';
import Logs from './Logs';

import './index.scss';

const DevelopmentSettings = () => (
	<div className="DevelopmentSettings__Container">
		<section>
			<Advanced />
		</section>
		<section>
			<Logs />
		</section>
	</div>
);

export default DevelopmentSettings;
