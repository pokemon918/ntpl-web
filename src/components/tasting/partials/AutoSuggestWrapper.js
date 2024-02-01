import React, {Component} from 'react';
import {connect} from 'react-redux';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import L18nText from 'components/shared/L18nText';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value, src) {
	const escapedValue = escapeRegexCharacters(value.trim());

	if (escapedValue === '') {
		return [];
	}

	return src.filter((input) => {
		let result = match(input, value);
		return result.length > 0;
	});
}

function getSuggestionValue(suggestion) {
	return suggestion;
}

function renderSuggestion(suggestion) {
	return <span>{suggestion}</span>;
}

class AutoSuggestWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			suggestions: [],
		};
	}

	static getDerivedStateFromProps = (props, state) => {
		const {src} = props;
		const {value} = state;

		if (value.length === 0) {
			return {
				...state,
				suggestions: src,
			};
		}

		return {
			...state,
			suggestions: getSuggestions(value, src),
		};
	};

	onChange = (event, {newValue, method}) => {
		this.props.infoCallBack({[this.props.infoKey]: newValue});
	};

	onSuggestionSelected = (
		event,
		{suggestion, suggestionValue, suggestionIndex, sectionIndex, method}
	) => {
		if (this.props.autoSuggestCallBack) {
			this.props.autoSuggestCallBack({[this.props.infoKey]: suggestion});
		}
	};

	shouldRenderSuggestions = (value) => {
		const {infoKey, info} = this.props;
		const isValid = !(
			info.autoSuggests &&
			info.autoSuggests[infoKey] &&
			info.autoSuggests[infoKey].find((name) => name === value)
		);

		if (isValid) {
			if (infoKey === 'tasting_name' || infoKey === 'tasting_region') {
				return this.onChange;
			}
			if (value.length > 0) {
				return this.onChange;
			}
		}
	};

	onSuggestionsFetchRequested = () => null;

	onSuggestionsClearRequested = () => null;

	render() {
		const {value, label, infoKey, isLoading, placeholder} = this.props;

		const suggestions =
			this.props.info && this.props.info.autoSuggests && this.props.info.autoSuggests[infoKey]
				? this.props.info.autoSuggests[infoKey]
				: [];
		const suggestionText = isLoading && infoKey !== 'tasting_country' ? ['Loading'] : suggestions;

		return (
			<div className="form-group row">
				{label && (
					<label htmlFor="wine-name" className="col-sm-2 col-form-label">
						<L18nText id={label} defaultMessage={label} />
					</label>
				)}
				<div className="col-sm-10 info-field-wrapper">
					<L18nText id={placeholder || 'shared_empty'} defaultMessage={placeholder}>
						{(placeholder) => {
							const inputProps = {
								placeholder,
								value,
								onChange: this.onChange,
							};

							return (
								<Autosuggest
									shouldRenderSuggestions={this.shouldRenderSuggestions}
									suggestions={suggestionText.slice(0, 30)}
									onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
									onSuggestionsClearRequested={this.onSuggestionsClearRequested}
									getSuggestionValue={getSuggestionValue}
									renderSuggestion={renderSuggestion}
									inputProps={inputProps}
									onSuggestionSelected={this.onSuggestionSelected}
								/>
							);
						}}
					</L18nText>
				</div>
			</div>
		);
	}
}

AutoSuggestWrapper.defaultProps = {
	label: '',
	placeholder: '',
	src: [],
};

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user,
		info: state.info,
	};
}

export default connect(mapStateToProps)(AutoSuggestWrapper);
