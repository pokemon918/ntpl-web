import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SearchBar from 'components/shared/ui/SearchBar';
import './ElementsList.scss';
import L18nText from 'components/shared/L18nText';
import {isTextInText} from 'components/contest/common';

export default class ElementsList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listItems: [],
		};
	}

	componentDidMount() {
		const {children} = this.props;
		this.setState({listItems: children});
	}

	componentDidUpdate(prev) {
		const {children} = this.props;
		if (prev.children !== children) this.setState({listItems: children});
	}

	handleChange(needle) {
		const {children} = this.props;
		const listItems = children.props.children.filter((item) => {
			let haystack = item.props?.children?.lastItem.props['data-find'];
			return isTextInText(needle, haystack);
		});

		this.setState({listItems});
	}

	render() {
		const {listItems} = this.state;

		return (
			<div className="ElementsList__Container">
				<SearchBar placeholder="shared_empty" onHandleChange={(e) => this.handleChange(e)} />
				<div className="ElementsList__List__Container">
					{listItems}
					{((listItems.props && !listItems.props.children.length) ||
						(Array.isArray(listItems) && !listItems.length)) && (
						<div className="ElementsList_Empty">
							<L18nText id="wine_tasting_empty" default="No wine to select." />
						</div>
					)}
				</div>
			</div>
		);
	}
}

ElementsList.propTypes = {
	children: PropTypes.node,
};
