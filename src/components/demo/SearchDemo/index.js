import React, {Component} from 'react';
import classNames from 'classnames';

import Grid from 'components/shared/ui/Grid';
import SearchBar from 'components/shared/ui/SearchBar';

import {WebWorkerEngineAdapter} from './adapters';
import './SearchDemo.scss';

class SearchDemo extends Component {
	state = {
		search: '',
		loaded: false,
		hasError: false,
		loadErrors: null,
		hovering: false,
		displaySuggestions: false,
		suggestionIndex: -1,
		suggestions: [],
		filteredItems: [],
		resultStart: 1,
		resultEnd: 10,
	};

	componentDidMount() {
		this.searchEngine = new WebWorkerEngineAdapter(
			this.onSearchReady,
			this.onSearchError,
			this.handleSearchResponse
		);
	}

	componentWillUnmount() {
		if (typeof this.searchEngine.close === 'function') {
			this.searchEngine.close();
		}
	}

	onSearchReady = () => {
		this.setState({loaded: true, hasError: false, loadErrors: null});
		this.handleChange('');
	};

	onSearchError = (loadErrors) => {
		this.setState({hasError:true, loadErrors});
	};

	normalizeSearch(search) {
		if (typeof search === 'object') {
			return search.data ? search.data.NAME : search.toString();
		}
		return search;
	}

	handleChange = async (q) => {
		if (!this.state.loaded) return;

		try {
			this.setState({search: this.normalizeSearch(q)});
			const results = this.searchEngine.search(q);
			if (results) {
				const {suggestions, filteredItems} = results;
				this.setState({hasError: false, suggestions, filteredItems});
			}
		} catch (ex) {
			this.setState({hasError: true});
		}
	};

	handleSearchResponse = (data) => {
		if (data.q !== this.state.search) return;

		const {suggestions, filteredItems} = data.results;
		this.setState({hasError: false, suggestions, filteredItems});
	};

	handleKeyDown = (ev) => {
		const DIRECTION_UP = -1;
		const DIRECTION_DOWN = 1;

		const keyEvents = {
			ArrowUp: this.moveSuggestionIndex(DIRECTION_UP),
			ArrowDown: this.moveSuggestionIndex(DIRECTION_DOWN),
			Backspace: this.openSuggestions,
			Enter: this.confirmSuggestion,
			Escape: this.closeSuggestions,
		};
		const currentEvent = keyEvents[ev.key];
		if (currentEvent) {
			currentEvent(ev);
		}
	};

	moveSuggestionIndex = (direction) => () => {
		const {suggestions, suggestionIndex} = this.state;
		let toIndex = suggestionIndex + direction;

		if (toIndex < -1) toIndex = suggestions.length - 1;
		if (toIndex < 0) toIndex = -1;
		if (toIndex >= suggestions.length) toIndex = -1;

		this.setState({displaySuggestions: true, suggestionIndex: toIndex});
	};

	confirmSuggestion = () => {
		const {suggestions, suggestionIndex} = this.state;
		const item = suggestions[suggestionIndex];
		this.selectSuggestion(item);
	};

	selectSuggestion = (item) => {
		this.setState({search: this.normalizeSearch(item), displaySuggestions: false});
		if (item) {
			this.handleChange(item);
		}
	};

	openSuggestions = () => {
		this.setState({displaySuggestions: true, suggestionIndex: -1});
	};

	closeSuggestions = () => {
		this.setState({suggestionIndex: -1});

		if (!this.state.hovering) {
			this.setState({displaySuggestions: false});
		}
	};

	startHovering = () => {
		this.setState({hovering: true});
	};

	finishHovering = () => {
		this.setState({hovering: false, suggestionIndex: -1});
	};

	formatSuggestion = (suggestion) => {
		if (typeof suggestion !== 'string') {
			if (suggestion.data) {
				if (suggestion.data.NAME) {
					return suggestion.data.NAME;
				}
				return suggestion.data.toString();
			}
			return suggestion.toString();
		}
		return suggestion;
	};

	renderSuggestions() {
		const {displaySuggestions, suggestions, suggestionIndex} = this.state;
		if (!displaySuggestions || !suggestions.length) return null;

		return (
			<div
				className="SearchDemo__Suggestions__Wrapper"
				onMouseEnter={this.startHovering}
				onMouseLeave={this.finishHovering}
			>
				<div className="SearchDemo__Suggestions__Container">
					{suggestions.map((item, index) => (
						<div
							key={this.formatSuggestion(item)}
							onClick={() => this.selectSuggestion(item)}
							className={classNames('SearchDemo__SuggestionItem', {
								active: index === suggestionIndex,
							})}
						>
							{this.formatSuggestion(item)}
						</div>
					))}
				</div>
			</div>
		);
	}

	renderFilteredItems() {
		const {
			search,
			loaded,
			loadErrors,
			hasError,
			filteredItems,
			resultStart,
			resultEnd,
		} = this.state;

		if (hasError)
			return (
				<div className="EmptyMessage">
					Failed to search!{' '}
					<details>
						<pre>
							<code>{JSON.stringify(loadErrors)}</code>
						</pre>
					</details>
				</div>
			);

		if (!loaded) return <div className="EmptyMessage">Please wait, loading...</div>;

		if (hasError)
			return <div className="EmptyMessage">Failed to load wine data, please try again</div>;

		if (!filteredItems.length)
			return search ? (
				<div className="EmptyMessage">Nothing found, please try another search</div>
			) : (
				<div className="EmptyMessage">Type something above to start searching</div>
			);

		const displayedItems = filteredItems.slice(resultStart, resultEnd);

		return (
			<>
				<div className="SearchDemo__FilteredItems">
					{displayedItems.map((item) => (
						<div key={item.ID} className="SearchDemo__Item">
							<div>{item.NAME} - </div>
							<div>{item.PRODUCER}, </div>
							<div>{item.COUNTRY}, </div>
							<div>{item['REGION / AREA']}</div>
						</div>
					))}
				</div>
			</>
		);
	}

	render() {
		return (
			<div className="SearchDemo__Container">
				<h1>Search Demo</h1>
				<Grid columns={6}>
					<div className="SearchDemo__InputWrapper">
						<SearchBar
							value={this.state.search}
							onHandleChange={(value) => {
								this.handleChange(value);
								this.openSuggestions();
							}}
							onClick={this.openSuggestions}
							onBlur={this.closeSuggestions}
							onKeyDown={this.handleKeyDown}
						/>
						{this.renderSuggestions()}
					</div>
				</Grid>
				<Grid columns={6}>{this.renderFilteredItems()}</Grid>
			</div>
		);
	}
}

export default SearchDemo;
