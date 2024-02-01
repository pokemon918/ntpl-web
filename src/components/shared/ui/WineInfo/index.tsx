import React from 'react';
import classNames from 'classnames';
import {MdFavorite, MdFavoriteBorder} from 'react-icons/md';

import {format, parse} from 'date-fns';

import sampleWinePlaceholder from './sample-wine-placeholder.jpg';
import {ReactComponent as NoScoreIcon} from './no-score.svg';
import './WineInfo.scss';
import L18nText from 'components/shared/L18nText';
import {getCurrency} from 'commons/commons';
import Spinner from 'components/shared/ui/Spinner';

const getCountryCode = (countryId: string) => `country_${countryId.toUpperCase()}`;

const formatDate = (date: string) => format(parse(date), 'YYYY/MM/DD');

interface Props {
	id?: string;
	name?: string;
	price?: number;
	isLoading?: boolean;
	currency?: string;
	producer?: string;
	vintage?: number;
	region?: string;
	countryKey?: string;
	countryName?: string;
	score?: number;
	updatedRef?: boolean;
	location?: string;
	date?: string;
	image?: string;
	displayImage?: string;
	hideNoVingate?: boolean;
	isEventWine?: boolean;
	isChosen?: boolean;
	handleToggleChosen?: (isChosen: boolean) => void;
}

const WineInfo = ({
	id,
	name,
	isLoading,
	price = 0,
	currency,
	producer,
	vintage = 0,
	region,
	countryKey,
	countryName,
	score = 0,
	location,
	date,
	updatedRef,
	image,
	displayImage,
	hideNoVingate,
	isEventWine,
	isChosen,
	handleToggleChosen,
}: Props) => (
	<div className="WineInfo__Container">
		<div className="WineInfo__Details" data-test={`WineInfo__${id}`}>
			<div className="WineInfo__Demographics">
				{!isEventWine && !hideNoVingate && (
					<span className="WineInfo__Location">{date ? formatDate(date) : 'Non vintage'}</span>
				)}
				{!isEventWine && location && <span> | </span>}
				{location && <span className="WineInfo__Wine_Location">{location}</span>}
			</div>
			<section>
				<div className="WineInfo__Producer">{producer}</div>
				<div className="WineInfo__Name">{name}</div>
			</section>
			<section>
				<div className="WineInfo__Location">
					<span>{region}</span>
					{region && (countryKey || countryName) ? ', ' : null}
					<span>{countryKey ? <L18nText id={getCountryCode(countryKey)} /> : countryName}</span>
				</div>
			</section>
			<span className="WineInfo__Location">{+vintage || 'Non vintage'}</span>
			{price > 0 && (
				<div className="WineInfo__Price">
					<L18nText id="app.price" defaultMessage="Price" />: {getCurrency(price, currency)}
				</div>
			)}
		</div>
		{!isEventWine && (
			<div className={classNames('WineInfo__Picture', {image: displayImage})}>
				<>
					{displayImage ? (
						<img src={image || sampleWinePlaceholder} alt={name} />
					) : (
						<div className="WineInfo__ScoreWrapper hi">
							<div className="WineInfo__ScoreValue">
								{parseInt(score.toString(), 10) || <NoScoreIcon />}
							</div>
						</div>
					)}
				</>
				{handleToggleChosen && (
					<div
						className={`WineInfo__ChosenMark fade ${updatedRef && 'show'} ${
							isLoading && 'disabled'
						}`}
						onClick={() => handleToggleChosen(!isChosen)}
					>
						{isLoading ? (
							<Spinner inline small />
						) : isChosen ? (
							<MdFavorite />
						) : (
							<MdFavoriteBorder />
						)}
					</div>
				)}
			</div>
		)}
	</div>
);

WineInfo.defaultProps = {
	score: 0,
	isEventWine: false,
};

export default WineInfo;
