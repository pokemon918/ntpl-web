import React, {Component} from 'react';
import {FaPlus, FaMinus} from 'react-icons/fa';
import L18nText from 'components/shared/L18nText';

export default class CollapseHeader extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
	}

	toggle(sortBy) {
		this.props.toggleCollapseCallback();
	}

	render() {
		const {title} = this.props;

		return (
			<h4 className="collapse-header" onClick={this.toggle}>
				{title && <L18nText id={title} defaultMessage={title} />}
				{this.props.isOpen ? (
					<FaMinus className="collapse-trigger" />
				) : (
					<FaPlus className="collapse-trigger" />
				)}
			</h4>
		);
	}
}

CollapseHeader.defaultProps = {
	title: 'The title',
	isOpen: false,
};
