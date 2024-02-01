import React from 'react';
import classNames from 'classnames';

import './SlidingSingleSelector.scss';
import PropTypes from 'prop-types';
import L18nText from 'components/shared/L18nText';

class SlidingSingleSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: null,
			selectedOffset: 0,
			mouseDownEvent: null,
		};
		this.wrapperNode = null;
		this.containerNode = null;
		this.selectedNode = null;
		this.sliderDrag = false;
		this.selectedItemIndex = null;
		this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
		this.mouseDownHandler = this.mouseDownHandler.bind(this);
		this.mouseUpHandler = this.mouseUpHandler.bind(this);
	}

	componentDidMount() {
		if (this.props.selectedOption) {
			const {id} = this.props.selectedOption;
			let defaultSelectedIndex = this.props.options.findIndex((item) => item.id === id);
			if (defaultSelectedIndex === -1) {
				defaultSelectedIndex = Math.round(this.props.options.length / 2);
			}
			this.setState({
				selectedIndex: defaultSelectedIndex,
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.selectedNode && prevState.selectedIndex !== this.state.selectedIndex) {
			const wrapperRect = this.wrapperNode.getBoundingClientRect();
			const itemRect = this.selectedNode.getBoundingClientRect();
			const edgeRect = this.selectedNode.parentElement.children[0].getBoundingClientRect();

			// account for position of the first sibling to calculate own translated position
			const realX = itemRect.x - edgeRect.x;
			const centerX = wrapperRect.width / 2 - itemRect.width / 2;
			const destX = centerX - realX;
			if (this.state.selectedOffset !== destX) {
				this.setState({
					selectedOffset: destX,
				});
			}
		}
	}

	changeSelectedIndex() {
		if (this.selectedItemIndex || this.selectedItemIndex === 0) {
			const {onChange, title} = this.props;
			this.setState({
				selectedIndex: this.selectedItemIndex,
			});
			onChange(this.props.options[this.selectedItemIndex], title);
		}
	}

	mouseMoveHandler(event) {
		if (!this.sliderDrag) return;
		this.moveHandler(event.clientX);
	}

	moveHandler(clientX) {
		const countOptions = this.props.options.length;
		const selectedIndex = this.state.selectedIndex;
		const {onChange, title} = this.props;
		let newIndex;
		if (this.state.mouseDownEvent > clientX) {
			newIndex = selectedIndex + 1 > countOptions ? selectedIndex : selectedIndex + 1;
			this.setState({
				selectedIndex: newIndex,
			});
			onChange(this.props.options[newIndex], title);
		} else if (this.state.mouseDownEvent < clientX) {
			newIndex = selectedIndex - 1 < 0 ? selectedIndex : selectedIndex - 1;
			this.setState({
				selectedIndex: newIndex,
			});
			onChange(this.props.options[newIndex], title);
		}
		this.sliderDrag = false;
		this.selectedItemIndex = null;
	}

	touchMoveHandler(event) {
		if (!this.sliderDrag) return;
		this.moveHandler(event.touches[0].clientX);
	}

	mouseDownHandler(event) {
		this.sliderDrag = true;
		if (this.state.mouseDownEvent !== event.clientX) {
			this.setState({
				mouseDownEvent: event.clientX,
			});
		}
	}

	touchStartHandler(event) {
		this.sliderDrag = true;
		if (this.state.mouseDownEvent !== event.touches[0].clientX) {
			this.setState({
				mouseDownEvent: event.touches[0].clientX,
			});
		}
	}

	mouseUpHandler() {
		this.sliderDrag = false;
	}

	render() {
		const {options, title} = this.props;
		return (
			<div
				ref={(wrapperNode) => {
					this.wrapperNode = wrapperNode;
				}}
				className="SlidingSingleSelector__Wrapper"
			>
				{title && (
					<div className="SlidingSingleSelector__Title">
						<L18nText id={title} defaultMessage={title} />
					</div>
				)}
				<div className="SlidingSingleSelector__Block">
					<div
						ref={(containerNode) => {
							this.containerNode = containerNode;
						}}
						className="SlidingSingleSelector__Container"
						onMouseDown={(event) => this.mouseDownHandler(event)}
						onTouchStart={(event) => this.touchStartHandler(event)}
						onMouseMove={(event) => this.mouseMoveHandler(event)}
						onTouchMove={(event) => this.touchMoveHandler(event)}
						onMouseUp={() => this.mouseUpHandler()}
						style={{
							left: this.state.selectedOffset ? this.state.selectedOffset : 0,
						}}
					>
						{options.map((item, index) => {
							const isSelected = this.state.selectedIndex === index;
							return (
								<div
									ref={
										isSelected
											? (selectedNode) => {
													this.selectedNode = selectedNode;
											  }
											: null
									}
									key={index}
									className={classNames('SlidingSingleSelector__Item', {
										isSelected,
									})}
									onMouseDown={() => (this.selectedItemIndex = index)}
									onMouseUp={() => this.changeSelectedIndex()}
								>
									<L18nText id={item.description} defaultMessage={item.description} />
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

SlidingSingleSelector.propTypes = {
	options: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	selectedOption: PropTypes.object,
};

SlidingSingleSelector.defaultProps = {
	options: [],
	onChange: () => {},
};

export default SlidingSingleSelector;
