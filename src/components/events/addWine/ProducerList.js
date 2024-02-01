import React from 'react';
import {ReactComponent as ChevronIcon} from './Icon_ChevronRight.svg';
import L18nText from 'components/shared/L18nText';

const ProducerList = ({onHandleChange, wineList = []}) => (
	<div className="ProducerList__Wrapper">
		<div className="ProducerList__Header">
			<div className="ProducerList__Producer">
				<L18nText id="app.producer" defaultMessage="Producer" />
			</div>
			<div className="ProducerList__Region">
				<L18nText id="app.region" defaultMessage="Region" />
			</div>
			<div className="ProducerList__Country">
				<L18nText id="app.country" defaultMessage="Country" />
			</div>
			<div className="ProducerList__Next"></div>
		</div>
		{wineList.map((wine) => (
			<div className="ProducerList__Item" onClick={() => onHandleChange(wine)}>
				<div className="ProducerList__Producer">{wine.producer}</div>
				<div className="ProducerList__Region">{wine.region}</div>
				<div className="ProducerList__Country">{wine.country}</div>
				<div className="ProducerList__Next">
					<ChevronIcon />
				</div>
			</div>
		))}
		{!wineList.length && (
			<div className="ProducerList__Empty">
				<L18nText id="app.noWine" defaultMessage="No wine to display." />
			</div>
		)}
	</div>
);

export default ProducerList;
