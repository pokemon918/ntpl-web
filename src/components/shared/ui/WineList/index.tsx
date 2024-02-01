import React from 'react';

import {IWineResponse} from 'types/wines';

import WineInfo from '../WineInfo';

import './WineList.scss';

interface Props {
	wines: IWineResponse[];
	onClickWine: (ref: string) => void;
}

const WineList = ({wines = [], onClickWine}: Props) => (
	<div className="WineList__Container">
		{wines.map(
			({
				ref,
				name,
				producer,
				vintage,
				region,
				price,
				currency,
				location,
				country_key = '',
				country = '',
				created_at = '',
				rating,
			}) => {
				return (
					<div key={ref} className="WineList__Item" onClick={() => onClickWine(ref)}>
						<WineInfo
							key={ref}
							id={ref}
							name={name}
							price={price}
							currency={currency}
							producer={producer}
							vintage={vintage}
							region={region}
							countryKey={country_key}
							countryName={country}
							location={location}
							date={created_at}
							score={rating ? rating.final_points : 0}
						/>
					</div>
				);
			}
		)}
	</div>
);

export default WineList;
