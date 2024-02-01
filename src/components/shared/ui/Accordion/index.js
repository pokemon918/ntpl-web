import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import L18nText from 'components/shared/L18nText';
import {ReactComponent as ChevronUp} from './Icon_ChevronUp.svg';
import {ReactComponent as ChevronDown} from './Icon_ChevronDown.svg';

import './Accordion.scss';

class Accordion extends React.Component {
	state = {
		isOpen: false,
		showHideAnimation: false,
	};

	onToggleAccordion = () => {
		if (this.state.isOpen) {
			this.setState({showHideAnimation: true});
			setTimeout(() => {
				return this.setState({isOpen: false});
			}, 200);
		} else {
			this.setState({showHideAnimation: false});

			return this.setState({isOpen: true});
		}
	};

	componentDidMount() {
		this.setState({isOpen: !!this.props.defaultView});
	}

	render() {
		const {isOpen, showHideAnimation} = this.state;
		const {expandText, collapseText, children, noBorder, description} = this.props;

		const title = isOpen ? expandText : collapseText;
		const iconImage = isOpen ? <ChevronUp /> : <ChevronDown />;

		const headerClass = classnames('Accordion__Header', {
			inactive: isOpen,
			'no-border': noBorder,
		});

		const accordionClass = classnames('Accordion__Body', {
			Accordion__Show: isOpen,
			Accordion__Hide: !isOpen,
			Accordion__Hide__Animation: showHideAnimation,
		});
		return (
			<div className="Accordion__Wrapper">
				<div className={headerClass} onClick={this.onToggleAccordion}>
					<span className="Accordion__Title">
						<L18nText id={title} />
					</span>
					{description && <L18nText id={description} />}
					<span className="Accordion__Icon">{iconImage}</span>
				</div>
				<div className={accordionClass}>{children}</div>
			</div>
		);
	}
}

Accordion.propTypes = {
	children: PropTypes.node.isRequired,
	expandText: PropTypes.string.isRequired,
	collapseText: PropTypes.string.isRequired,
	description: PropTypes.string,
};

export default Accordion;
