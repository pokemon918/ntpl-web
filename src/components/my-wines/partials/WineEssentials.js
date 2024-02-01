import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import L18nText from 'components/shared/L18nText';

import WineNotes from './WineNotes';
import './WineEssentials.scss';

const WineEssentials = ({features = {}, metadata, otherObservations = [], isStep = false}) => {
	const generalNotes = get(features, '@', []);
	const wineType = getWineType(generalNotes);
	const color = getColor(generalNotes);

	let notes, nose, palate;
	if (features.nose || features.palate) {
		nose = getNotes(features.nose).filter((item) => {
			return !otherObservations.includes(item);
		});
		palate = getNotes(features.palate);
	} else {
		notes = getNotes(generalNotes);
	}

	return (
		<div className="WineDetails__FeatureList">
			{wineType && !isStep && (
				<div className="WineDetails__FeatureItem">
					<label>
						<L18nText id="wine_" defaultMessage="Wine" />
					</label>
					<span>
						<L18nText id={wineType} defaultMessage="None" />
					</span>
				</div>
			)}
			{color && !isStep && (
				<div className="WineDetails__FeatureItem">
					<label>
						<L18nText id="color_" defaultMessage="Colour" />
					</label>
					<span>
						<L18nText id={color} defaultMessage="None" />
					</span>
				</div>
			)}
			{notes && (
				<div className="WineDetails__FeatureItem">
					<label>
						<L18nText id="notes_" defaultMessage="Notes" />
					</label>
					<WineNotes notes={notes} />
				</div>
			)}
			{nose && nose.length > 0 && (
				<div className="WineDetails__FeatureItem">
					<label>
						<L18nText id="nose_" defaultMessage="Nose" />
					</label>
					<WineNotes notes={nose} />
				</div>
			)}
			{palate && palate.length > 0 && (
				<div className="WineDetails__FeatureItem">
					<label>
						<L18nText id="palate_" defaultMessage="Palate" />
					</label>
					<WineNotes notes={palate} />
				</div>
			)}
			{metadata && metadata.notes_input_other && (
				<div className="WineDetails__FeatureItem">
					<label>
						<L18nText id="tasting_other_notes" />
					</label>
					<span>{metadata.notes_input_other}</span>
				</div>
			)}
			{otherObservations && otherObservations.length > 0 && (
				<div className="WineDetails__FeatureItem">
					<label>
						<L18nText id="other_observations_" defaultMessage="Other observations" />
					</label>
					<WineNotes notes={otherObservations} />
				</div>
			)}
		</div>
	);
};

WineEssentials.propTypes = {
	features: PropTypes.arrayOf(PropTypes.string),
	metadata: PropTypes.shape({
		notes_input_other: PropTypes.string,
	}),
};

function getWineType(notes) {
	return notes.find((i) => (i && i.startsWith('category_')) || i.startsWith('type_'));
}

function getColor(notes) {
	return notes.find((i) => (i && i.startsWith('color_')) || i.startsWith('nuance_'));
}

function getNotes(features) {
	return features
		.filter((note) => typeof note === 'string')
		.filter(
			(note) => note.startsWith('note_') || note.startsWith('notes_') || note.startsWith('trait_')
		);
}

export default WineEssentials;
