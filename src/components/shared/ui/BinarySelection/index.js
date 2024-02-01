import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './BinarySelection.scss';

class BinarySelection extends React.Component {
	state = {
		isActive: '',
	};

	componentDidMount() {
		const {selected} = this.props;

		this.setState({isActive: selected});
	}

	// Toggle isActive state and trigger onSelect function.
	onHandleChange = (value, item) => {
		this.setState({isActive: value});

		this.props.onSelect(value, item);
	};

	render() {
		const {item} = this.props;
		const {isActive} = this.state;

		const selectionTrueClass = classnames('BinarySelection_Item', {
			active: isActive === true,
		});

		const selectionFalseClass = classnames('BinarySelection_Item', {
			active: isActive === false,
		});

		return (
			<div className="BinarySelection_Container">
				<div onClick={() => this.onHandleChange(true, item)} className={selectionTrueClass}>
					Yes
				</div>
				<div onClick={() => this.onHandleChange(false, item)} className={selectionFalseClass}>
					No
				</div>
			</div>
		);
	}
}

BinarySelection.propTypes = {
	item: PropTypes.object,
	onSelect: PropTypes.func,
	selected: PropTypes.oneOf([true, false]),
};

export default BinarySelection;
