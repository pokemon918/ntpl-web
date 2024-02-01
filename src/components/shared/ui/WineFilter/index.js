import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import sortingConfig from 'assets/json/sorting_config.json';
import L18nText from 'components/shared/L18nText';
import RadioDropdown from 'components/shared/ui/RadioDropdown';
import SearchBar from 'components/shared/ui/SearchBar';

import {filterWines, sortWines} from './functions';
import './WineFilter.scss';

const defaultSorting = sortingConfig.options.find((i) => i.id === sortingConfig.defaultOption);

const HIDE_RESULTS_ANIMATION_TIMEOUT = 500;

const WineFilter = ({children, wines = []}) => {
	const [search, setSearch] = useState('');
	const [selectedSorting, changeSorting] = useState(defaultSorting);
	const filteredWines = filterWines(wines, search);
	const sortedWines = sortWines(filteredWines, selectedSorting);

	const [resultsHidden, setResultsHidden] = useState(false);
	const animateChangeSorting = (newSorting) => {
		setResultsHidden(true);
		setTimeout(() => {
			changeSorting(newSorting);
			setResultsHidden(false);
		}, HIDE_RESULTS_ANIMATION_TIMEOUT);
	};

	const noTastings = wines.length === 0;
	const emptySearch = wines.length > 0 && sortedWines.length === 0;
	const EmptyMessage = (props) => (
		<div className="WineFilter__EmptyMessage">
			<L18nText {...props} />
		</div>
	);

	return (
		<div className="WineFilter__Container">
			<SearchBar
				infoKey="WineFilter__searchInput"
				placeholder="wine_search_placeholder"
				onHandleChange={setSearch}
			/>
			<div className="WineFilter__SortContainer">
				<L18nText id="tasting_sort_by" defaultMessage="Sort by:" />
				<RadioDropdown
					selected={selectedSorting}
					items={sortingConfig.options}
					onChange={animateChangeSorting}
					alignRight
				/>
			</div>
			{noTastings && <EmptyMessage id="wine_empty" defaultMessage="No wines tasted so far" />}
			{emptySearch && (
				<EmptyMessage
					id="wine_search_empty"
					defaultMessage="No tastings found, please try another search."
				/>
			)}
			<div className={classNames('WineFilter__Results', {resultsHidden})}>
				{typeof children === 'function' && children({wines: sortedWines})}
			</div>
		</div>
	);
};

WineFilter.propTypes = {
	wines: PropTypes.array,
};

export default WineFilter;
