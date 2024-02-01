import React from 'react';

import ElementsList from './index';

export default {
	title: 'UI Kit / General / Elements List',
	component: ElementsList,
};

const sampleRowStyle = {
	marginTop: '20px',
	color: '#b0a5b8',
	fontFamily: 'Raleyway, sans-serif',
	fontSize: '1rem',
};

export const normal = () => (
	<div style={{width: '40%'}}>
		<ElementsList>
			<div>
				<div data-find="Palacio de Anglona Pinot Noir" style={sampleRowStyle}>
					<span>Palacio de Anglona Pinot Noir</span>
				</div>
				<div data-find="Palacio de Anglona Pinot Noir" style={sampleRowStyle}>
					<span>Palacio de Anglona Pinot Noir</span>
				</div>
				<div data-find="Palacio de Anglona Merlot" style={sampleRowStyle}>
					<span>Palacio de Anglona Merlot</span>
				</div>
			</div>
		</ElementsList>
	</div>
);
